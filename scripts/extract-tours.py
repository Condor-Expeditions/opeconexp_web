"""Snapshot FICHA TOUR only, without evaluating formulas or editing public tour data."""

import json
import posixpath
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NS = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
RID = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"


def extract(path):
    with zipfile.ZipFile(path) as archive:
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            strings = ["".join(item.itertext()) for item in ET.fromstring(archive.read("xl/sharedStrings.xml"))]
        relations = {item.get("Id"): item.get("Target") for item in ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))}
        sheets = ET.fromstring(archive.read("xl/workbook.xml")).find("s:sheets", NS)
        sheet = next(item for item in sheets if item.get("name") == "FICHA TOUR")
        target = relations[sheet.get(RID)]
        target = target.lstrip("/") if target.startswith("/") else posixpath.normpath("xl/" + target)
        cells, formulas = {}, {}
        for cell in ET.fromstring(archive.read(target)).findall(".//s:sheetData/s:row/s:c", NS):
            address = cell.get("r")
            value = cell.find("s:v", NS)
            value = value.text if value is not None else ""
            if cell.get("t") == "s" and value:
                value = strings[int(value)]
            elif cell.get("t") == "inlineStr":
                value = "".join(cell.find("s:is", NS).itertext())
            formula = cell.find("s:f", NS)
            if formula is not None:
                formulas[address] = formula.text
            if value:
                cells[address] = value
        return {"file": path.name, "sheet": "FICHA TOUR", "cells": cells, "formulas": formulas}


if __name__ == "__main__":
    destination = ROOT / "src/data/tours/source"
    destination.mkdir(parents=True, exist_ok=True)
    for path in sorted((ROOT / "public/tmp").glob("*.xlsx")):
        snapshot = extract(path)
        tour_id = re.search(r"(?:NAT|ARQ|CULT|ARTE|FWT)-\d{3}", path.name).group()
        # Stable catalog IDs, approved despite stale IDs inside the workbooks.
        if tour_id == "NAT-005":
            tour_id = "CULT-002"
        snapshot["tourId"] = tour_id
        (destination / f"{tour_id}.json").write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n")
        print(f"{tour_id}: {len(snapshot['cells'])} celdas de FICHA TOUR")
