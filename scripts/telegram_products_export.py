#!/usr/bin/env python3
"""
Export Telegram group messages and extract product-like records for WooCommerce prep.

Setup:
  1. Create a Telegram API app at https://my.telegram.org
  2. Export credentials:
       export TG_API_ID=123456
       export TG_API_HASH=your_api_hash
  3. Install dependency:
       pip install telethon
  4. Run:
       python3 scripts/telegram_products_export.py --chat "your_group" --download-media
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import json
import os
import re
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Tuple

from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError
from telethon.tl.custom.message import Message


PRICE_PATTERNS = [
    re.compile(r"(?P<price>\d[\d\s]{1,12})\s*(?:грн|₴|uah)\b", re.IGNORECASE),
    re.compile(r"(?:ціна|price)\s*[:\-]?\s*(?P<price>\d[\d\s]{1,12})", re.IGNORECASE),
]
SKU_PATTERNS = [
    re.compile(r"(?:артикул|sku|код)\s*[:\-]?\s*(?P<sku>[A-Z0-9\-_./]{3,})", re.IGNORECASE),
]
CATEGORY_PATTERNS = [
    re.compile(r"(?:категорія|category)\s*[:\-]?\s*(?P<category>[^\n]+)", re.IGNORECASE),
]
SIZE_PATTERNS = [
    re.compile(r"(?:розмір|size)\s*[:\-]?\s*(?P<size>[^\n]+)", re.IGNORECASE),
]
COLOR_PATTERNS = [
    re.compile(r"(?:колір|цвет|color)\s*[:\-]?\s*(?P<color>[^\n]+)", re.IGNORECASE),
]
NAME_PREFIXES = (
    "ціна",
    "price",
    "артикул",
    "sku",
    "код",
    "розмір",
    "size",
    "колір",
    "цвет",
    "наявність",
    "в наявності",
)


@dataclass
class ProductRecord:
    message_id: int
    date: str
    source_chat: str
    topic_id: str = ""
    topic_title: str = ""
    title: str = ""
    description: str = ""
    price: str = ""
    currency: str = "UAH"
    sku: str = ""
    category: str = ""
    colors: str = ""
    sizes: str = ""
    availability: str = ""
    photo_paths: List[str] = field(default_factory=list)
    source_url: str = ""
    raw_text: str = ""

    def to_csv_row(self) -> Dict[str, str]:
        payload = asdict(self)
        payload["photo_paths"] = "|".join(self.photo_paths)
        return payload

    def to_woocommerce_row(self) -> Dict[str, str]:
        category = self.category or self.topic_title
        return {
            "Type": "simple",
            "SKU": self.sku,
            "Name": self.title,
            "Published": "1",
            "Is featured?": "0",
            "Visibility in catalog": "visible",
            "Short description": self.description[:240],
            "Description": self.description or self.raw_text,
            "Tax status": "taxable",
            "In stock?": "1" if self.availability != "backorder" else "0",
            "Stock": "",
            "Regular price": self.price,
            "Sale price": "",
            "Categories": category,
            "Images": ", ".join(self.photo_paths),
            "Attribute 1 name": "Колір",
            "Attribute 1 value(s)": self.colors,
            "Attribute 1 visible": "1" if self.colors else "0",
            "Attribute 1 global": "1" if self.colors else "0",
            "Attribute 2 name": "Розмір",
            "Attribute 2 value(s)": self.sizes,
            "Attribute 2 visible": "1" if self.sizes else "0",
            "Attribute 2 global": "1" if self.sizes else "0",
        }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Export Telegram products from a group or channel."
    )
    parser.add_argument(
        "--chat",
        required=True,
        help='Telegram chat username, invite link, or numeric id, e.g. "my_group".',
    )
    parser.add_argument(
        "--output-dir",
        default="output/telegram_export",
        help="Directory for exported files.",
    )
    parser.add_argument(
        "--session",
        default=".telegram_session",
        help="Path prefix for the Telethon session file.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Maximum number of messages to read. 0 means all available messages.",
    )
    parser.add_argument(
        "--download-media",
        action="store_true",
        help="Download message photos into output-dir/media.",
    )
    parser.add_argument(
        "--reverse",
        action="store_true",
        help="Process older messages first.",
    )
    parser.add_argument(
        "--include-non-product",
        action="store_true",
        help="Keep all text messages in the raw export, even if product heuristics do not match.",
    )
    return parser.parse_args()


def getenv_required(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise SystemExit(
            f"Missing environment variable {name}. "
            "Create it in your shell before running the script."
        )
    return value


def clean_whitespace(text: str) -> str:
    return re.sub(r"[ \t]+", " ", re.sub(r"\r\n?", "\n", text or "")).strip()


def normalize_price(raw_price: str) -> str:
    return re.sub(r"\s+", "", raw_price)


def extract_first(patterns: Sequence[re.Pattern], text: str, key: str) -> str:
    for pattern in patterns:
        match = pattern.search(text)
        if match:
            return clean_whitespace(match.group(key))
    return ""


def looks_like_product(text: str, has_media: bool) -> bool:
    text_l = text.lower()
    score = 0
    if has_media:
        score += 1
    if extract_first(PRICE_PATTERNS, text, "price"):
        score += 2
    if extract_first(SKU_PATTERNS, text, "sku"):
        score += 1
    if any(token in text_l for token in ("наяв", "замов", "колір", "размер", "розмір", "матеріал")):
        score += 1
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if lines and len(lines[0]) > 4:
        score += 1
    return score >= 2


def derive_title(lines: Sequence[str]) -> str:
    for line in lines:
        candidate = line.strip(" -•*")
        if not candidate:
            continue
        if candidate.lower().startswith(NAME_PREFIXES):
            continue
        if re.search(r"\d+\s*(грн|₴|uah)\b", candidate, re.IGNORECASE):
            continue
        return candidate[:180]
    return ""


def derive_description(lines: Sequence[str], title: str) -> str:
    filtered: List[str] = []
    skipped_title = False
    for line in lines:
        normalized = line.strip()
        if not normalized:
            continue
        if not skipped_title and title and normalized == title:
            skipped_title = True
            continue
        filtered.append(normalized)
    return "\n".join(filtered)


def build_source_url(chat: str, message: Message) -> str:
    if getattr(message, "id", None) is None:
        return ""
    if str(chat).startswith("@"):
        return f"https://t.me/{chat[1:]}/{message.id}"
    if re.fullmatch(r"[A-Za-z0-9_]{5,}", str(chat)):
        return f"https://t.me/{chat}/{message.id}"
    return ""


def get_topic_info(message: Message) -> Tuple[Optional[int], bool]:
    reply_to = getattr(message, "reply_to", None)
    if not reply_to:
        return None, False

    forum_topic = bool(getattr(reply_to, "forum_topic", False))
    topic_id = getattr(reply_to, "reply_to_top_id", None)
    if topic_id is None and forum_topic:
        topic_id = getattr(reply_to, "reply_to_msg_id", None)

    return topic_id, forum_topic


def extract_topic_title(message: Message, raw_text: str) -> str:
    action = getattr(message, "action", None)
    title = clean_whitespace(getattr(action, "title", "") or "")
    if title:
        return title

    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    if not lines:
        return ""
    first = lines[0]
    if len(first) <= 80 and not looks_like_product(raw_text, bool(message.media)):
        return first
    return ""


def parse_record(
    message: Message,
    chat_ref: str,
    media_paths: List[str],
    topic_id: Optional[int] = None,
    topic_title: str = "",
) -> ProductRecord:
    raw_text = clean_whitespace(message.message or "")
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    title = derive_title(lines)
    price = normalize_price(extract_first(PRICE_PATTERNS, raw_text, "price"))
    sku = extract_first(SKU_PATTERNS, raw_text, "sku")
    category = extract_first(CATEGORY_PATTERNS, raw_text, "category")
    sizes = extract_first(SIZE_PATTERNS, raw_text, "size")
    colors = extract_first(COLOR_PATTERNS, raw_text, "color")

    availability = ""
    raw_lower = raw_text.lower()
    if "в наявності" in raw_lower or "в наличии" in raw_lower:
        availability = "in_stock"
    elif "під замовлення" in raw_lower or "под заказ" in raw_lower:
        availability = "backorder"

    return ProductRecord(
        message_id=message.id,
        date=message.date.isoformat(),
        source_chat=chat_ref,
        topic_id=str(topic_id or ""),
        topic_title=topic_title,
        title=title,
        description=derive_description(lines, title),
        price=price,
        sku=sku,
        category=category,
        colors=colors,
        sizes=sizes,
        availability=availability,
        photo_paths=media_paths,
        source_url=build_source_url(chat_ref, message),
        raw_text=raw_text,
    )


def ensure_dirs(base_dir: Path, download_media: bool) -> Dict[str, Path]:
    raw_dir = base_dir / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)
    media_dir = base_dir / "media"
    if download_media:
        media_dir.mkdir(parents=True, exist_ok=True)
    return {"raw": raw_dir, "media": media_dir}


async def maybe_download_media(
    client: TelegramClient,
    message: Message,
    media_dir: Path,
    enabled: bool,
) -> List[str]:
    if not enabled or not message.media:
        return []

    downloaded = await client.download_media(
        message,
        file=str(media_dir / f"message_{message.id}"),
    )
    if not downloaded:
        return []
    if isinstance(downloaded, list):
        return [str(Path(path).resolve()) for path in downloaded]
    return [str(Path(downloaded).resolve())]


async def authorize_if_needed(client: TelegramClient) -> None:
    await client.connect()
    if await client.is_user_authorized():
        return

    phone = input("Telegram phone number (with country code): ").strip()
    await client.send_code_request(phone)
    code = input("Telegram login code: ").strip()
    try:
        await client.sign_in(phone=phone, code=code)
    except SessionPasswordNeededError:
        password = input("Telegram 2FA password: ").strip()
        await client.sign_in(password=password)


async def export_messages(args: argparse.Namespace) -> None:
    api_id = int(getenv_required("TG_API_ID"))
    api_hash = getenv_required("TG_API_HASH")

    output_dir = Path(args.output_dir).resolve()
    dirs = ensure_dirs(output_dir, args.download_media)

    client = TelegramClient(args.session, api_id, api_hash)
    await authorize_if_needed(client)

    raw_messages_path = dirs["raw"] / "messages.jsonl"
    products_json_path = output_dir / "products.json"
    products_csv_path = output_dir / "products.csv"
    woocommerce_csv_path = output_dir / "products_woocommerce.csv"

    records: List[ProductRecord] = []
    raw_count = 0
    raw_messages_path.write_text("", encoding="utf-8")
    topic_titles: Dict[int, str] = {}

    async with client:
        async for message in client.iter_messages(
            args.chat,
            limit=args.limit or None,
            reverse=args.reverse,
        ):
            raw_count += 1
            raw_text = clean_whitespace(message.message or "")
            has_media = bool(message.media)
            topic_id, forum_topic = get_topic_info(message)
            explicit_topic_title = extract_topic_title(message, raw_text)
            if forum_topic and topic_id and explicit_topic_title and topic_id not in topic_titles:
                topic_titles[topic_id] = explicit_topic_title
            elif explicit_topic_title and getattr(getattr(message, "action", None), "title", None):
                topic_titles[message.id] = explicit_topic_title

            media_paths = await maybe_download_media(
                client,
                message,
                dirs["media"],
                args.download_media,
            )

            raw_payload = {
                "message_id": message.id,
                "date": message.date.isoformat() if message.date else None,
                "text": raw_text,
                "has_media": has_media,
                "media_paths": media_paths,
                "topic_id": topic_id,
                "forum_topic": forum_topic,
                "topic_title_guess": explicit_topic_title,
            }
            with raw_messages_path.open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(raw_payload, ensure_ascii=False) + "\n")

            if not raw_text:
                continue
            if not args.include_non_product and not looks_like_product(raw_text, has_media):
                continue

            resolved_topic_title = topic_titles.get(topic_id or 0, "")
            records.append(
                parse_record(
                    message,
                    args.chat,
                    media_paths,
                    topic_id=topic_id,
                    topic_title=resolved_topic_title,
                )
            )

    for record in records:
        if record.topic_id and not record.topic_title:
            record.topic_title = topic_titles.get(int(record.topic_id), "")
        if not record.category and record.topic_title:
            record.category = record.topic_title

    with products_json_path.open("w", encoding="utf-8") as fh:
        json.dump([asdict(record) for record in records], fh, ensure_ascii=False, indent=2)

    with products_csv_path.open("w", encoding="utf-8", newline="") as fh:
        fieldnames = list(ProductRecord(0, "", "").to_csv_row().keys())
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        for record in records:
            writer.writerow(record.to_csv_row())

    woocommerce_fieldnames = list(ProductRecord(0, "", "").to_woocommerce_row().keys())
    with woocommerce_csv_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=woocommerce_fieldnames)
        writer.writeheader()
        for record in records:
            if not record.title:
                continue
            writer.writerow(record.to_woocommerce_row())

    print(f"Read {raw_count} messages")
    print(f"Extracted {len(records)} product-like records")
    print(f"Raw messages: {raw_messages_path}")
    print(f"Products JSON: {products_json_path}")
    print(f"Products CSV: {products_csv_path}")
    print(f"WooCommerce CSV: {woocommerce_csv_path}")
    if args.download_media:
        print(f"Media dir: {dirs['media']}")


def main() -> None:
    args = parse_args()
    asyncio.run(export_messages(args))


if __name__ == "__main__":
    main()
