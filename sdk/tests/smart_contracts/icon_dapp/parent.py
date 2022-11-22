from boa3.builtin import NeoMetadata, metadata, public


# -------------------------------------------
# METADATA
# -------------------------------------------

@metadata
def manifest_metadata() -> NeoMetadata:
    meta = NeoMetadata()
    meta.description = "Parent Auxiliary smart contract"
    meta.name = "Parent"
    return meta


@public
def main() -> str:
    return "Parent"
