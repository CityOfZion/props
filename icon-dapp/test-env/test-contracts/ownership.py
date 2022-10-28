from boa3.builtin import NeoMetadata, metadata, public


# -------------------------------------------
# METADATA
# -------------------------------------------

@metadata
def manifest_metadata() -> NeoMetadata:
    meta = NeoMetadata()
    meta.description = "Ownership Auxiliary smart contract"
    meta.name = "Ownership"
    return meta


@public
def main() -> str:
    return "Ownership"
