import random
from PIL import Image, ImageDraw, ImageFont
import time
import os
import string


class Captcha(object):

    font_path = os.path.join(os.path.dirname(__file__),'verdana.ttf')

    number = 4
    size = (100,40)
    bgcolor = (0,0,0)

    random.seed(int(time.time()))
    fontcolor = (random.randint(200,255),random.randint(100,255),random.randint(100,255))

    fontsize = 20

    linecolor = (random.randint(0,250),random.randint(0,255),random.randint(0,250))

    draw_line = True

    draw_point = True

    line_number = 3

    SOURCE = list(string.ascii_letters)
    for index in range(0, 10):
        SOURCE.append(str(index))

    @classmethod
    def gene_text(cls):
        return ''.join(random.sample(cls.SOURCE,cls.number))

    @classmethod
    def __gene_line(cls,draw,width,height):
        begin = (random.randint(0, width), random.randint(0, height))
        end = (random.randint(0, width), random.randint(0, height))
        draw.line([begin, end], fill = cls.linecolor)


    @classmethod
    def __gene_points(cls,draw,point_chance,width,height):
        chance = min(100, max(0, int(point_chance)))
        for w in range(width):
            for h in range(height):
                tmp = random.randint(0, 100)
                if tmp > 100 - chance:
                    draw.point((w, h), fill=(0, 0, 0))


    @classmethod
    def gene_code(cls):
        width,height = cls.size
        image = Image.new('RGBA',(width,height),cls.bgcolor)
        font = ImageFont.truetype(cls.font_path,cls.fontsize)
        draw = ImageDraw.Draw(image)
        text = cls.gene_text()
        font_width, font_height = font.getsize(text)
        draw.text(((width - font_width) / 2, (height - font_height) / 2),text,font= font,fill=cls.fontcolor)

        if cls.draw_line:
            for x in range(0,cls.line_number):
                cls.__gene_line(draw,width,height)

        if cls.draw_point:
            cls.__gene_points(draw,10,width,height)

        return (text,image)