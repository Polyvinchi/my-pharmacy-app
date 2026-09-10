from PIL import Image, ImageDraw

def create_layout(logo_path, out_path, width, height, logo_scale=0.6):
    # Create white canvas
    canvas = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(canvas)
    
    # Draw thin bright green border (e.g. 10 pixels thick)
    border_color = '#39FF14' # Neon/Bright Green
    border_width = 10
    draw.rectangle(
        [border_width//2, border_width//2, width - border_width//2, height - border_width//2],
        outline=border_color,
        width=border_width
    )
    
    # Open and process logo
    # The logo has a white background. To blend perfectly, we ensure canvas is white.
    logo = Image.open(logo_path).convert('RGB')
    
    # Calculate scale to fit within canvas while respecting logo_scale
    logo_w, logo_h = logo.size
    
    # Max dimensions for logo
    max_w = int(width * logo_scale)
    max_h = int(height * logo_scale)
    
    # Scaling factor
    scale = min(max_w / logo_w, max_h / logo_h)
    new_w = int(logo_w * scale)
    new_h = int(logo_h * scale)
    
    logo_resized = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Paste logo centered
    x = (width - new_w) // 2
    y = (height - new_h) // 2
    
    canvas.paste(logo_resized, (x, y))
    
    canvas.save(out_path, quality=95)
    print(f"Created {out_path}")

logo_file = 'logo_final_2_leaves_clean.jpg'

# 1. Business Card (Standard 3.5 x 2 inches -> ~ 1050 x 600 pixels)
create_layout(logo_file, 'mockup_business_card.jpg', 1050, 600, logo_scale=0.7)

# 2. Signboard (Wide, e.g. 3000 x 1000 pixels)
create_layout(logo_file, 'mockup_signboard.jpg', 3000, 1000, logo_scale=0.8)

# 3. Poster (Vertical, e.g. 1080 x 1920 pixels)
create_layout(logo_file, 'mockup_poster.jpg', 1080, 1920, logo_scale=0.5)

