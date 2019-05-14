import ffmpeg
from pydub import AudioSegment


t1 = 0 * 1000 #Works in milliseconds
t2 = 3 * 1000
t3 = 3 * 1000 #Works in milliseconds
t4 = 7 * 1000
t5 = 8 * 1000 #Works in milliseconds
t6 = 13 * 1000
t7 = 16 * 1000 #Works in milliseconds
t8 = 19 * 1000
t9 = 20 * 1000 #Works in milliseconds
t10 = 25 * 1000
newAudio = AudioSegment.from_wav('merged_emo_for_demo.wav')
print(len(newAudio))
newAudio1 = newAudio[t1:t2]
newAudio1.export('data/data/01-01-04-04-04.wav', format="wav")

newAudio2 = newAudio[t3:t4]
newAudio2.export('data/data/02-01-05-05-05.wav', format="wav")

newAudio3 = newAudio[t5:t6]
newAudio3.export('data/data/03-01-03-03-03.wav', format="wav")

newAudio3 = newAudio[t7:t8]
newAudio3.export('data/data/04-01-04-04-04.wav', format="wav")

newAudio3 = newAudio[t9:t10]
newAudio3.export('data/data/05-01-03-03-03.wav', format="wav")
"""
import ffmpeg
ffmpeg -i merged_emo_for_demo.wav -f segment -segment_time 3 -c copy data/data/output%09d.wav
"""
