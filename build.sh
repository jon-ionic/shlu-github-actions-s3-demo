echo "Running build script"
npm run build

echo "Installing Appflow CLI"
curl -fsSL https://ionic.io/get-appflow-cli | bash

echo "Running swad script"
python3 swad.py
echo "Script executed successfully."

APPFLOW_BIN="$(which appflow)"
echo "Removing Appflow CLI at $APPFLOW_BIN"
rm -rf $APPFLOW_BIN
echo "Removed Appflow CLI"

echo "Build script successful".