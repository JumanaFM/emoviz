from keras.models import load_model
import numpy as np
import os
import pandas as pd

X=np.load('demo_features.npy')
y=np.load('demo_labels.npy')

# test1=np.load('test1.npy')

train_x=X
test_x=X
train_y=y
test_y=y

model = load_model('demo_model.h5')

#model.compile(loss='categorical_crossentropy', optimizer=optimiser, metrics=['accuracy'])

#predicting from the model  lstrip
predict=model.predict(test_x,batch_size=4)
np.save('prediction',predict)

print(predict)

emotions=['neutral', 'calm', 'happy', 'sad', 'angry', 'fearful', 'disgust', 'surprised']
#predicted emotions from the test set
y_pred = np.argmax(predict, 1)
print(y_pred)

predicted_emo=[]
for i in range(0, y_pred.shape[0]):
  emo=emotions[y_pred[i]]
  predicted_emo.append(emo)

print(predicted_emo)


actual_emo=[]
y_true=np.argmax(test_y, 1)

for i in range(0,test_y.shape[0]):
  emo=emotions[y_true[i]]
  actual_emo.append(emo)
