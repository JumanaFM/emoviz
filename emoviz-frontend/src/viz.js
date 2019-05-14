var sample_data = [
  {
    "audio": "audio1",
    "segment": "segment1",
    "emotion": "anger",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment2",
    "emotion": "anticipation",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment3",
    "emotion": "disgust",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment4",
    "emotion": "fear",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment5",
    "emotion": "joy",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment6",
    "emotion": "negative",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment7",
    "emotion": "positive",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment8",
    "emotion": "sadness",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment9",
    "emotion": "surprise",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment10",
    "emotion": "trust",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment11",
    "emotion": "anger",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment12",
    "emotion": "anticipation",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment13",
    "emotion": "disgust",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment14",
    "emotion": "fear",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment15",
    "emotion": "joy",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment16",
    "emotion": "negative",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment17",
    "emotion": "positive",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment18",
    "emotion": "sadness",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment19",
    "emotion": "surprise",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment20",
    "emotion": "trust",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment21",
    "emotion": "anger",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment22",
    "emotion": "anticipation",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment23",
    "emotion": "disgust",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment24",
    "emotion": "fear",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment25",
    "emotion": "joy",
    "value": 1
  },
  {
    "audio": "audio1",
    "segment": "segment26",
    "emotion": "negative",
    "value": 1
  }
]


// [
//    {"year": 3, "name":"alpha", "value": 20},
//    {"year": 4, "name":"alpha", "value": 30},
//    {"year": 5, "name":"alpha", "value": 60},
//    {"year": 3, "name":"beta", "value": 40},
//    {"year": 4, "name":"beta", "value": 60},
//    {"year": 5, "name":"beta", "value": 10},
//    {"year": 4, "name":"gamma", "value": 10},
//    {"year": 5, "name":"gamma", "value": 40}
//  ]

 // var visualization = d3plus.viz()
 //   .container("#viz")
 //   .data(sample_data)
 //   .type("stacked")
 //   .id("emotion")
 //   .text("emotion")
 //   .y("value")
 //   .x("segment")
 //   .aggs({"value": "mean"})
 //
 //   .color({"scale":"category20b"})
 //   .axes({"background":{"color": "#fff"}})
 //   .draw()


   var visualization2 = d3plus.viz()
     .container("#viz")
     .data(sample_data)
     .type("bar")
     .id("emotion")
     .text("emotion")
     .y("value")
     .x("segment")
     .color({"scale":"category20b"})
     .axes({"background":{"color": "#fff"}})
     .draw()

     var visualization2 = d3plus.viz()
       .container("#viz2")
       .data(sample_data)
       .type("tree_map")
       .id("emotion")
       .text("emotion")
       .size("value")
       .color({"scale":"category20b"})
       .axes({"background":{"color": "#fff"}})
       .draw()
