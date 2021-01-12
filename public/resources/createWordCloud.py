# model program
import re
import jieba
import wordcloud
import sys
def createWC(language, filePath, imgPath, imgWidth=400, imgHeight=200, imgBgC="black"):
    f = open(filePath, encoding="utf-8")
    txt = f.read()
    f.close()
    rTxt = re.sub('[\{\}\[\]\"\":0-9_/-=&\? %,+\(\)]+', " ", txt)
    rTxt = re.sub('\s+', " ", rTxt)
    rStr = ""
    if language == "Chinese":
        ls = jieba.lcut(rTxt)
        rStr = "".join(ls)
    elif language == "English":
        rStr = rTxt
    else:
        print("incorrect input")
        return
    w = wordcloud.WordCloud(font_path="msyh", width=imgWidth, height=imgHeight, background_color=imgBgC)
    w.generate(rStr)
    w.to_file(imgPath)
    print("success")

def main():
    argv = sys.argv
    length = len(argv)
    if(length < 4):
        print("at least three parameters(language, filePaht，imagePaht)")
        return
    if(length == 4):
        createWC(argv[1], argv[2], argv[3])
    elif length == 5:
        createWC(argv[1], argv[2], argv[3], int(argv[4]))
    elif length == 6:
        createWC(argv[1], argv[2], argv[3], int(argv[4]), int(argv[5]))
    else:
        createWC(argv[1], argv[2], argv[3], int(argv[4]), int(argv[5]), argv[6])

main()
#end
