import xml.etree.ElementTree as ET
import gzip

# Setup for iterative parsing
max_parse = 10
parsed_elems = 0
target_tag = "release"


with gzip.open("./discogs_releases.xml.gz", mode="rb") as f:
    context = ET.iterparse(f, events=("end",))
    for event, elem in context:
        if elem.tag == target_tag:
            print(ET.tostring(elem, encoding="unicode")[:100])
            parsed_elems += 1
        if parsed_elems >= max_parse:
            break
        elem.clear()
