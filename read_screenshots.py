from PIL import Image
import os

screenshots_dir = r'c:\Users\Mridul Mishra\Desktop\Afford'
files = sorted([f for f in os.listdir(screenshots_dir) if f.startswith('Screenshot') and f.endswith('.png')])

for i, file in enumerate(files, 1):
    path = os.path.join(screenshots_dir, file)
    try:
        img = Image.open(path)
        print(f'{i}. {file}')
        print(f'   Size: {img.size}')
    except Exception as e:
        print(f'{i}. {file} - Error: {e}')
