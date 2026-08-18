import os
import shutil

# Ensure directory exists
output_dir = r"c:\Users\vishn\Desktop\Projects\Arox\Arox-main\assets\services"
os.makedirs(output_dir, exist_ok=True)
# Copy AI generated images to assets/services
artifacts_dir = r"C:\Users\vishn\.gemini\antigravity\brain\9ec67923-8564-4a7b-84f8-eab46436f185"
ai_images = {
    "software_development_light.jpg": "software_development_light_1787045102497.jpg",
    "software_development_dark.jpg": "software_development_dark_1787045717928.jpg",
    "web_development_light.jpg": "web_development_light_1787045744330.jpg",
    "web_development_dark.jpg": "web_development_dark_1787046306277.jpg",
    "app_development_light.jpg": "app_development_light_1787046823086.jpg",
    "app_development_dark.jpg": "app_development_dark_1787047219497.jpg",
    "api_integration_light.jpg": "api_integration_light_1787047365262.jpg",
    "api_integration_dark.jpg": "api_integration_dark_1787047988347.jpg",
}
for dest_name, src_name in ai_images.items():
    src_path = os.path.join(artifacts_dir, src_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, os.path.join(output_dir, dest_name))
        print(f"Copied AI image: {dest_name}")
print("Copied available AI images.")
