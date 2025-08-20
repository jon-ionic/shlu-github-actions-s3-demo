curl -fsSL https://ionic.io/get-appflow-cli | bash
python3 swad.py
rm -rf $(which appflow)
echo "Removed Appflow CLI"