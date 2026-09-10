from PIL import Image
import numpy as np

def hex_to_rgb(hex_code):
    hex_code = hex_code.lstrip('#')
    return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))

def recolor_image(img_path, bg_color, text_color, bowl_color, leaf_color):
    img = Image.open(img_path).convert('RGB')
    arr = np.array(img)
    
    # Calculate masks
    # Background: mostly white
    is_bg = (arr[:,:,0] > 230) & (arr[:,:,1] > 230) & (arr[:,:,2] > 230)
    
    # Text: mostly black/dark
    is_text = (arr[:,:,0] < 80) & (arr[:,:,1] < 80) & (arr[:,:,2] < 80)
    
    # Red leaves: high Red, low Green/Blue
    is_leaf = (arr[:,:,0] > 100) & (arr[:,:,1] < 80) & (arr[:,:,2] < 80) & ~is_text
    
    # Bowl (Gold): High Red/Green, low Blue
    is_bowl = (arr[:,:,0] > 150) & (arr[:,:,1] > 120) & (arr[:,:,2] < 120) & ~is_leaf & ~is_text & ~is_bg
    
    out_arr = arr.copy()
    
    # Apply colors
    out_arr[is_bg] = hex_to_rgb(bg_color)
    out_arr[is_text] = hex_to_rgb(text_color)
    out_arr[is_leaf] = hex_to_rgb(leaf_color)
    out_arr[is_bowl] = hex_to_rgb(bowl_color)
    
    return Image.fromarray(out_arr)

# 10 Variations
variations = [
    {"bg": "#0D47A1", "text": "#FFFFFF", "bowl": "#D4AF37", "leaf": "#C62828"}, # 1. Storefront matching
    {"bg": "#0D47A1", "text": "#FFFFFF", "bowl": "#FFFFFF", "leaf": "#FFFFFF"}, # 2. All white on blue
    {"bg": "#0D47A1", "text": "#FFFFFF", "bowl": "#C62828", "leaf": "#C62828"}, # 3. White text, Red logo on blue (User idea)
    {"bg": "#FFFFFF", "text": "#0D47A1", "bowl": "#D4AF37", "leaf": "#0D47A1"}, # 4. White bg, blue text/leaf, gold bowl
    {"bg": "#111111", "text": "#D4AF37", "bowl": "#D4AF37", "leaf": "#D4AF37"}, # 5. Dark mode, all gold
    {"bg": "#C62828", "text": "#FFFFFF", "bowl": "#D4AF37", "leaf": "#FFFFFF"}, # 6. Red bg, white/gold
    {"bg": "#E3F2FD", "text": "#0D47A1", "bowl": "#C62828", "leaf": "#C62828"}, # 7. Light blue bg, blue text, red logo
    {"bg": "#FFFFFF", "text": "#0D47A1", "bowl": "#0D47A1", "leaf": "#0D47A1"}, # 8. Minimalist all blue
    {"bg": "#000000", "text": "#FFFFFF", "bowl": "#D4AF37", "leaf": "#C62828"}, # 9. Black luxury
    {"bg": "#D4AF37", "text": "#0D47A1", "bowl": "#FFFFFF", "leaf": "#C62828"}, # 10. Gold bg
]

images = []
for i, var in enumerate(variations):
    img = recolor_image('perfect_base_logo.png', var['bg'], var['text'], var['bowl'], var['leaf'])
    images.append(img)
    img.save(f'recolored_{i+1}.jpg')

# Create a grid 5x2
w, h = images[0].size
grid = Image.new('RGB', (w * 5, h * 2))
for i, img in enumerate(images):
    grid.paste(img, ((i % 5) * w, (i // 5) * h))
grid.save('color_variations_grid.jpg')
