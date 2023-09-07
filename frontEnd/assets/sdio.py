import os

# Define the path to your project's root and the assets file
project_path = "../"
assets_file = "./index.ts"

# Extract asset names from the assets file
with open(assets_file, 'r') as file:
    content = file.read()

asset_names = [line.split(' ')[1] for line in content.splitlines() if 'from' in line]

# Check each asset for references in the project
unused_assets = []

for asset in asset_names:
    cmd = f'grep -r "{asset}" {project_path}'
    result = os.popen(cmd).read()

    if not result:
        unused_assets.append(asset)

print("Unused Assets:")
for asset in unused_assets:
    print(asset)
