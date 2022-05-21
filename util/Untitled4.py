#!/usr/bin/env python
# coding: utf-8

# In[1]:


from PIL import Image
from pytesseract import pytesseract
import sys
  
path_to_tesseract = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
# image_path = r"C:\Users\USER\Desktop\tests\template2.jpg"

image_path = sys.argv[1];
# Opening the image & storing it in an image object

img = Image.open(image_path)
  
pytesseract.tesseract_cmd = path_to_tesseract
  
text = pytesseract.image_to_string(img)
  
# Displaying the extracted text
print(text[:-1])




