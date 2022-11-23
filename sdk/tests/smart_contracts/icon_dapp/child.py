from boa3.builtin import NeoMetadata, metadata, public


# -------------------------------------------
# METADATA
# -------------------------------------------

@metadata
def manifest_metadata() -> NeoMetadata:
    meta = NeoMetadata()
    meta.description = "Child Auxiliary smart contract"
    meta.name = "Child"
    return meta


@public
def main() -> str:
    return "Child"
