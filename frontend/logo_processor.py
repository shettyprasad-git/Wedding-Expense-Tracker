from PIL import Image, ImageDraw, ImageFont
import os

# Paths
source_img_path = r'C:\Users\prasa\.gemini\antigravity\brain\331be59e-0da8-426c-a227-5d897c907580\media__1776427706455.png'
output_dir = r'C:\Users\prasa\Prasad Shetty\Project\Marriage Expense Tracker\frontend\public\branding'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Open source icon
icon = Image.open(source_img_path).convert("RGBA")

# Color theme
text_color = (124, 58, 237) # #7C3AED Purple

def create_logo(name, layout='horizontal', size=(500, 150)):
    # USE A MASSIVE CANVAS FOR RENDERING TO PREVENT CLIPPING
    render_w = 5000
    render_h = 2000
    canvas = Image.new("RGBA", (render_w, render_h), (0,0,0,0))
    draw = ImageDraw.Draw(canvas)
    
    # Try to load a font
    font_size = int(size[1] * 0.4)
    if layout == 'stacked':
        font_size = int(size[1] * 0.3) # Slightly smaller for stacked to be safe
        
    try:
        # Common windows fonts
        font_paths = [
            "C:/Windows/Fonts/Outfit-Bold.ttf",
            "C:/Windows/Fonts/Inter-Bold.ttf",
            "C:/Windows/Fonts/SegoeUI-Bold.ttf",
            "C:/Windows/Fonts/arialbd.ttf"
        ]
        font = None
        for p in font_paths:
            if os.path.exists(p):
                font = ImageFont.truetype(p, font_size)
                break
        if not font:
            font = ImageFont.load_default()
    except:
        font = ImageFont.load_default()

    text = "Wedding Tracker"
    
    # Calculate text dimensions early
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_w = text_bbox[2] - text_bbox[0]
    text_h = text_bbox[3] - text_bbox[1]
    
    if layout == 'horizontal':
        # Resize icon
        icon_h = int(size[1] * 0.8)
        icon_w = int(icon.width * (icon_h / icon.height))
        icon_resized = icon.resize((icon_w, icon_h), Image.Resampling.LANCZOS)
        
        # Draw in center of massive canvas
        total_w = icon_w + 50 + text_w
        start_x = (render_w - total_w) // 2
        start_y = (render_h - max(icon_h, text_h)) // 2
        
        canvas.paste(icon_resized, (start_x, render_h // 2 - icon_h // 2), icon_resized)
        draw.text((start_x + icon_w + 50, render_h // 2 - text_h // 2 - text_bbox[1]), text, fill=text_color, font=font)
        
    elif layout == 'stacked':
        # Resize icon
        icon_h = int(size[1] * 0.5)
        icon_w = int(icon.width * (icon_h / icon.height))
        icon_resized = icon.resize((icon_w, icon_h), Image.Resampling.LANCZOS)
        
        total_h = icon_h + 40 + text_h
        start_y = (render_h - total_h) // 2
        
        canvas.paste(icon_resized, (render_w // 2 - icon_w // 2, start_y), icon_resized)
        draw.text((render_w // 2 - text_w // 2, start_y + icon_h + 40 - text_bbox[1]), text, fill=text_color, font=font)
        
    # Trim transparency with GENEROUS padding
    bbox = canvas.getbbox()
    if bbox:
        # Expand bbox for 100px safety margin
        safety_pad = 100
        bbox = (bbox[0] - safety_pad, bbox[1] - safety_pad, bbox[2] + safety_pad, bbox[3] + safety_pad)
        canvas = canvas.crop(bbox)
        canvas.save(os.path.join(output_dir, name))
        print(f"Saved {name} with size {canvas.size}")

# Favicon: Just the icon
icon_fav = icon.resize((512, 512), Image.Resampling.LANCZOS)
icon_fav.save(os.path.join(output_dir, 'favicon_icon.png'))
print("Saved favicon_icon.png")

# Navbar Logo
create_logo('navbar_logo.png', layout='horizontal', size=(1500, 300))

# Auth Logo
create_logo('auth_logo.png', layout='stacked', size=(1500, 1000))
