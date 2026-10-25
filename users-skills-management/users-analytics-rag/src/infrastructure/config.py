from pathlib import Path
from typing import Any, Dict
import yaml

def load_config() -> Dict[str, Any]:
    path = Path(__file__).resolve().parents[2] / "config.yml"
    with path.open(encoding="utf-8") as stream:
        return yaml.safe_load(stream)

config = load_config()
