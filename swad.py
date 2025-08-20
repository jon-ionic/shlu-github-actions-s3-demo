import subprocess
import json
import zipfile
import os
import sys

APPFLOW_CLI = "appflow"

def test_appflow_cli():
    try:
        subprocess.check_output([APPFLOW_CLI, "--version"])
    except FileNotFoundError:
        print("Appflow CLI not installed on PATH.")
        sys.exit(1)


def get_live_update_configs():
    cap_config = subprocess.check_output(["npx", "cap", "config", "--json"], text=True)
    cap_config_json = json.loads(cap_config)
    print("Successfully captured Capacitor config:", json.dumps(cap_config_json, indent=4))

    mfes = cap_config_json["app"]["extConfig"]["plugins"]["FederatedCapacitor"]["apps"]
    mfes_with_live_updates = filter(lambda m: 'liveUpdateConfig' in m, mfes)
    return list(mfes_with_live_updates)


def download_mfe(mfe):
    app_id = mfe["liveUpdateConfig"]["appId"]
    channel = mfe["liveUpdateConfig"]["channel"]
    web_dir = mfe["webDir"]
    zip_name = f"{app_id}-{channel}.zip"

    print(f"Downloading artifact for app id: {app_id}")

    output = subprocess.check_output([
        APPFLOW_CLI,
        "live-update",
        "download",
        f"--app-id={app_id}",
        f"--channel-name={channel}",
        f"--zip-name={zip_name}",
        "--json"
    ], text=True)

    print(f"Output for app id {app_id}: ", output)

    try:
        with zipfile.ZipFile(zip_name, 'r') as zip:
            zip.extractall(web_dir)
        print(f"Extracted {zip_name} to {web_dir}.")
    except zipfile.BadZipFile:
        print(f"Error: {zip_name} is not a valid zip file.")
        sys.exit(1)
    except FileNotFoundError:
        print(f"Error: Zip file not found at {zip_name}.")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        sys.exit(1)
    finally:
        print(f"Removing {zip_name}")
        os.remove(zip_name)


def download_all_mfes(mfes):
    for mfe in mfes:
        download_mfe(mfe)
    print("Successfully downloaded all MFEs.")


if __name__ == "__main__":
    test_appflow_cli()
    mfes = get_live_update_configs()
    download_all_mfes(mfes)
