from PIL import Image
from imaginairy_normal_map.model import create_normal_map_pil_img

img = Image.open("oval-office-large.jpg")
normal_img = create_normal_map_pil_img(img)
normal_img.save("oval-office-large-normal.jpg")
