from PIL import Image, ImageDraw, ImageFilter

def create_advanced_mockup(logo_path, out_path, bg_size, item_size, item_radius=20, is_card=True):
    # Background (Desk/Wall)
    bg_color = (230, 230, 230) if is_card else (50, 50, 50)
    bg = Image.new('RGB', bg_size, bg_color)
    
    # Item (Card/Signboard) mask
    item = Image.new('RGBA', item_size, (255, 255, 255, 255))
    draw = ImageDraw.Draw(item)
    
    # Green border inside the item
    border_color = '#39FF14' # Neon green
    border_w = 8 if is_card else 15
    draw.rectangle([0, 0, item_size[0]-1, item_size[1]-1], outline=border_color, width=border_w)
    
    # Process logo (ensure RGBA to preserve transparency if it exists, or handle white bg)
    logo = Image.open(logo_path).convert('RGBA')
    # If logo has white background instead of transparent, let's make white transparent 
    # (Optional, but if it's on a white card it doesn't matter!)
    
    # Scale logo
    logo_w, logo_h = logo.size
    scale = min((item_size[0] * 0.6) / logo_w, (item_size[1] * 0.6) / logo_h)
    new_w, new_h = int(logo_w * scale), int(logo_h * scale)
    logo_resized = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Paste logo onto item
    lx = (item_size[0] - new_w) // 2
    ly = (item_size[1] - new_h) // 2
    item.paste(logo_resized, (lx, ly), logo_resized)
    
    # Create shadow
    shadow_offset = (15, 15) if is_card else (30, 30)
    shadow = Image.new('RGBA', bg_size, (0,0,0,0))
    shadow_draw = ImageDraw.Draw(shadow)
    
    ix = (bg_size[0] - item_size[0]) // 2
    iy = (bg_size[1] - item_size[1]) // 2
    
    shadow_box = [ix + shadow_offset[0], iy + shadow_offset[1], 
                  ix + item_size[0] + shadow_offset[0], iy + item_size[1] + shadow_offset[1]]
    
    shadow_draw.rectangle(shadow_box, fill=(0, 0, 0, 80))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=20))
    
    # Composite everything
    final = bg.convert('RGBA')
    final = Image.alpha_composite(final, shadow)
    final.paste(item, (ix, iy), item)
    
    final.convert('RGB').save(out_path, quality=95)
    print(f"Created {out_path}")

# Logo file
logo_file = 'user_uploaded_logo.png'

# Business Card on desk (Bg: 1600x1200, Card: 1050x600)
create_advanced_mockup(logo_file, 'presentation_business_card.jpg', (1600, 1200), (1050, 600), is_card=True)

# Signboard on wall (Bg: 3000x1500, Board: 2400x800)
create_advanced_mockup(logo_file, 'presentation_signboard.jpg', (3000, 1500), (2400, 800), is_card=False)
