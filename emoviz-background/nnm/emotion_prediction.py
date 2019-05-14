import glob
import os
import librosa
import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Activation
from keras.layers import Dropout
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

#prep train and test set
X=np.load('features.npy')
y=np.load('labels.npy')

train_x, test_x, train_y, test_y = train_test_split(X, y, test_size=0.33, random_state=42)

#build DNN
n_dim = train_x.shape[1]
n_classes = train_y.shape[1]
n_hidden_units_1 = n_dim
n_hidden_units_2 = 400
n_hidden_units_3 = 200
n_hidden_units_4 = 200
n_hidden_units_5 = 100

def create_model(activation_function='relu', init_type='normal', optimiser='adam', dropout_rate=0.2):
  model = Sequential()
  # layer 1
  model.add(Dense(n_hidden_units_1, input_dim=n_hidden_units_1, kernel_initializer="normal", activation="relu"))
  # layer 2
  model.add(Dense(n_hidden_units_2, kernel_initializer="normal", activation="relu"))
  model.add(Dropout(dropout_rate))
  # layer 3
  model.add(Dense(n_hidden_units_3, kernel_initializer="normal", activation="relu"))
  model.add(Dropout(dropout_rate))
  #layer4
  model.add(Dense(n_hidden_units_4, kernel_initializer="normal", activation="relu"))
  model.add(Dropout(dropout_rate))
  #layer5
  model.add(Dense(n_hidden_units_5, kernel_initializer="normal", activation="relu"))
  model.add(Dropout(dropout_rate))
  # output layer
  model.add(Dense(n_classes, kernel_initializer="normal", activation="softmax"))
  #model compilation
  model.compile(loss='categorical_crossentropy', optimizer=optimiser, metrics=['accuracy'])
  return model;

#create the model
model = create_model()
model.summary()
#train the model
history = model.fit(train_x,train_y,epochs=6,batch_size=4)

#predicting from the model
predict=model.predict(test_x,batch_size=4)
np.save('prediction',predict)

emotions=['neutral', 'calm', 'happy', 'sad', 'angry', 'fearful', 'disgust', 'surprised']
#predicted emotions from the test set
y_pred = np.argmax(predict, 1)
np.save('y_pred',y_pred)

predicted_emo=[]
for i in range(1, y_pred.shape[0]):
  emo=emotions[y_pred[i]]
  predicted_emo.append(emo)

actual_emo=[]
y_true=np.argmax(test_y, 1)


for i in range(0,test_y.shape[0]):
  print('len', len(y_true))
  print('i', i)
  print('y_true[i]', y_true[i])


  emo=emotions[y_true[i]]
  actual_emo.append(emo)

print(predicted_emo)

cm =confusion_matrix(predicted_emo, actual_emo)
print(cm)
"""
index = ['angry', 'calm', 'disgust', 'fearful', 'happy', 'neutral', 'sad', 'surprised']
columns = ['angry', 'calm', 'disgust', 'fearful', 'happy', 'neutral', 'sad', 'surprised']
cm_df = pd.DataFrame(cm,index,columns)
plt.figure(figsize=(10,6))
sns.heatmap(cm_df, annot=True)
"""
