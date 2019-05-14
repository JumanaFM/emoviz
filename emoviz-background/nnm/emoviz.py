import sys
import os
import glob
import json


from pydub import AudioSegment
import librosa
import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Activation
from keras.layers import Dropout
from keras.models import load_model
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt


def extract_feature(file_name):
    X, sample_rate = librosa.load(file_name)
    stft = np.abs(librosa.stft(X))
    mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T,axis=0)
    chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T,axis=0)
    mel = np.mean(librosa.feature.melspectrogram(X, sr=sample_rate).T,axis=0)
    contrast = np.mean(librosa.feature.spectral_contrast(S=stft, sr=sample_rate).T,axis=0)
    tonnetz = np.mean(librosa.feature.tonnetz(y=librosa.effects.harmonic(X),
    sr=sample_rate).T,axis=0)
    return mfccs,chroma,mel,contrast,tonnetz;


def parse_audio_files(parent_dir,sub_dirs,file_ext="*.wav"):
    features, labels = np.empty((0,193)), np.empty(0)
    for label, sub_dir in enumerate(sub_dirs):
        for fn in sorted(glob.glob(os.path.join(parent_dir, sub_dir, file_ext))):
            try:
                mfccs, chroma, mel, contrast,tonnetz = extract_feature(fn)
            except Exception as e:
                # print ("Error encountered while parsing file: ", fn)
                continue
            ext_features = np.hstack([mfccs,chroma,mel,contrast,tonnetz])
            features = np.vstack([features,ext_features])
    return np.array(features)

def one_hot_encode(labels):
    n_labels = len(labels)
    n_unique_labels = len(np.unique(labels))
    one_hot_encode = np.zeros((n_labels,n_unique_labels+1))
    one_hot_encode[np.arange(n_labels), labels] = 1
    one_hot_encode=np.delete(one_hot_encode, 0, axis=1)
    return one_hot_encode;

def main():
    # Remove all file from data folder
    folder = os.path.abspath('nnm/data/data')
    for the_file in os.listdir(folder):
        file_path = os.path.join(folder, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(e)

    # Read file name to be processed
    file_name = sys.argv[1]
    # print('Processing:', file_name)

    # segment wav file
    audio = AudioSegment.from_wav('files/' + file_name)

    total = 0
    is_working = True
    c = 1

    while is_working:
        start = total * 1000
        total = total + 4
        end = total * 1000

        if end > len(audio):
        #     end = len(audio)
            is_working = False

        seg = audio[start: end]
        seg.export('nnm/data/data/' + str(c) + '.wav', format="wav")
        c = c + 1

    # Extract features
    main_dir = 'nnm/data'
    sub_dir=os.listdir(main_dir)
    features = parse_audio_files(main_dir,sub_dir)
    np.save('nnm/labelsEV',features)


    # Predict
    X = np.load('nnm/labelsEV.npy')
    train_x = X
    test_x = X
    model = load_model('nnm/demo_model2.h5')
    predict = model.predict(test_x,batch_size=4)
    np.save('nnm/predictionEV',predict)
    # print(predict)
    emotions = ['neutral', 'calm', 'happy', 'sad', 'angry', 'fearful', 'disgust', 'surprised']
    y_pred = np.argmax(predict, 1)
    # print(y_pred)

    predicted_emo=[]
    for i in range(0, y_pred.shape[0]):
        emo=emotions[y_pred[i]]
        predicted_emo.append(emo)

    # print(predicted_emo)
    my_json_string = json.dumps(predicted_emo)
    print(my_json_string)
    sys.stdout.flush()



if __name__ == '__main__':
    main()
