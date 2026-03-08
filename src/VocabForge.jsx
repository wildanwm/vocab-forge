import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// DATA: All 390 phrases categorized into semantic clusters
// ============================================================
const RAW_VOCAB = [
  // CLUSTER 1: Emotions & Feelings
  { en: "setback", ind: "kemunduran", cat: "Emotions & Feelings", ex: "Losing the match was a major setback for the team." },
  { en: "faith", ind: "keyakinan", cat: "Beliefs & Values", ex: "She has strong faith in her abilities." },
  { en: "triumph", ind: "kemenangan", cat: "Emotions & Feelings", ex: "The team celebrated their triumph over the champions." },
  { en: "envy", ind: "iri", cat: "Emotions & Feelings", ex: "He felt envy when he saw her new car." },
  { en: "upset", ind: "gundah", cat: "Emotions & Feelings", ex: "She was upset about the bad news." },
  { en: "pissed", ind: "kesal", cat: "Emotions & Feelings", ex: "He was really pissed about the delay." },
  { en: "mesmerize", ind: "mempesona", cat: "Emotions & Feelings", ex: "The magic show mesmerized the audience." },
  { en: "aching", ind: "sakit", cat: "Emotions & Feelings", ex: "My legs are aching after the long hike." },
  { en: "sore", ind: "sakit", cat: "Emotions & Feelings", ex: "My throat is sore from singing." },
  { en: "terrify", ind: "menakuti", cat: "Emotions & Feelings", ex: "Horror movies terrify small children." },
  { en: "terrified", ind: "ketakutan", cat: "Emotions & Feelings", ex: "She was terrified of the dark." },
  { en: "frighten", ind: "menakuti", cat: "Emotions & Feelings", ex: "Loud noises frighten my dog." },
  { en: "frightening", ind: "menakutkan", cat: "Emotions & Feelings", ex: "The storm was frightening." },
  { en: "horrify", ind: "menakuti", cat: "Emotions & Feelings", ex: "The accident scene horrified everyone." },
  { en: "horrified", ind: "ngeri", cat: "Emotions & Feelings", ex: "We were horrified by the damage." },
  { en: "horrifying", ind: "mengerikan", cat: "Emotions & Feelings", ex: "The news was horrifying." },
  { en: "gorgeous", ind: "menawan", cat: "Emotions & Feelings", ex: "What a gorgeous sunset!" },
  { en: "awful", ind: "buruk sekali", cat: "Emotions & Feelings", ex: "The food tasted awful." },
  { en: "terrible", ind: "buruk", cat: "Emotions & Feelings", ex: "The weather was terrible yesterday." },
  { en: "remarkable", ind: "luar biasa", cat: "Emotions & Feelings", ex: "She made a remarkable recovery." },
  { en: "doubt", ind: "ragu", cat: "Emotions & Feelings", ex: "I doubt he will come today." },
  { en: "indecisive", ind: "ragu", cat: "Emotions & Feelings", ex: "He's too indecisive to make quick decisions." },
  { en: "conscious", ind: "sadar", cat: "Emotions & Feelings", ex: "She became conscious of someone watching her." },
  { en: "suffer", ind: "menderita", cat: "Emotions & Feelings", ex: "Many people suffer from allergies." },

  // CLUSTER 2: Actions & Verbs (Daily)
  { en: "refuse", ind: "menolak", cat: "Actions (Daily)", ex: "He refused to answer the question." },
  { en: "relay", ind: "menyampaikan", cat: "Actions (Daily)", ex: "Please relay this message to the team." },
  { en: "nag", ind: "mengomel", cat: "Actions (Daily)", ex: "Stop nagging me about the dishes!" },
  { en: "stir up", ind: "menghasut", cat: "Actions (Daily)", ex: "Don't stir up trouble between friends." },
  { en: "begging", ind: "memohon", cat: "Actions (Daily)", ex: "The child was begging for ice cream." },
  { en: "begg", ind: "mengemis", cat: "Actions (Daily)", ex: "He begged on the street corner." },
  { en: "pretend", ind: "berpura-pura", cat: "Actions (Daily)", ex: "Don't pretend you didn't hear me." },
  { en: "warn", ind: "memperingatkan", cat: "Actions (Daily)", ex: "I warned you about the slippery floor." },
  { en: "staring", ind: "menatap", cat: "Actions (Daily)", ex: "Stop staring at people, it's rude." },
  { en: "grouse", ind: "menggerutu", cat: "Actions (Daily)", ex: "He always grouses about the weather." },
  { en: "flirting", ind: "menggoda", cat: "Actions (Daily)", ex: "She was flirting with the waiter." },
  { en: "wander", ind: "berjalan-jalan", cat: "Actions (Daily)", ex: "We wandered through the old streets." },
  { en: "wiggle", ind: "menggoyangkan", cat: "Actions (Daily)", ex: "The puppy wiggled its tail happily." },
  { en: "hurry", ind: "Cepatlah", cat: "Actions (Daily)", ex: "Hurry up or we'll miss the bus!" },
  { en: "guess", ind: "kira", cat: "Actions (Daily)", ex: "Can you guess what happened?" },
  { en: "lay", ind: "berbaring", cat: "Actions (Daily)", ex: "He lay down on the sofa." },
  { en: "hit", ind: "memukul", cat: "Actions (Daily)", ex: "Don't hit your brother!" },
  { en: "dismiss", ind: "memberhentikan", cat: "Actions (Daily)", ex: "The teacher dismissed the class early." },
  { en: "attract", ind: "menarik", cat: "Actions (Daily)", ex: "Bright colors attract butterflies." },
  { en: "lure", ind: "memancing", cat: "Actions (Daily)", ex: "They lured customers with free samples." },
  { en: "lured", ind: "terpikat", cat: "Actions (Daily)", ex: "She was lured by the promise of adventure." },

  // CLUSTER 3: Actions & Verbs (Formal/Professional)
  { en: "arbitrate", ind: "melerai", cat: "Actions (Formal)", ex: "A judge was called to arbitrate the dispute." },
  { en: "confiscate", ind: "menyita", cat: "Actions (Formal)", ex: "The teacher confiscated the phone." },
  { en: "comply", ind: "Mematuhi", cat: "Actions (Formal)", ex: "You must comply with the rules." },
  { en: "authorize", ind: "mengizinkan", cat: "Actions (Formal)", ex: "Only the manager can authorize this payment." },
  { en: "grant", ind: "menganugerahkan", cat: "Actions (Formal)", ex: "The court granted him bail." },
  { en: "impart", ind: "memberi", cat: "Actions (Formal)", ex: "Teachers impart knowledge to students." },
  { en: "exert", ind: "menggunakan", cat: "Actions (Formal)", ex: "Don't exert too much pressure on the wound." },
  { en: "invoke", ind: "memohon", cat: "Actions (Formal)", ex: "He invoked his right to remain silent." },
  { en: "prescribe", ind: "menentukan", cat: "Actions (Formal)", ex: "The doctor prescribed antibiotics." },
  { en: "compile", ind: "menyusun", cat: "Actions (Formal)", ex: "She compiled a list of references." },
  { en: "establish", ind: "didirikan", cat: "Actions (Formal)", ex: "The company was established in 1990." },
  { en: "constitute", ind: "merupakan", cat: "Actions (Formal)", ex: "These rules constitute the foundation." },
  { en: "incorporate", ind: "penggabungan", cat: "Actions (Formal)", ex: "We need to incorporate feedback." },
  { en: "intervene", ind: "campur tangan", cat: "Actions (Formal)", ex: "The police had to intervene." },
  { en: "depict", ind: "menggambarkan", cat: "Actions (Formal)", ex: "The painting depicts a rural scene." },
  { en: "interpret", ind: "menafsirkan", cat: "Actions (Formal)", ex: "How do you interpret this data?" },
  { en: "determine", ind: "menentukan", cat: "Actions (Formal)", ex: "We need to determine the cause." },
  { en: "distinguish", ind: "membedakan", cat: "Actions (Formal)", ex: "Can you distinguish between the two?" },
  { en: "possess", ind: "memiliki", cat: "Actions (Formal)", ex: "He possesses great talent." },
  { en: "omit", ind: "menghilangkan", cat: "Actions (Formal)", ex: "Don't omit any important details." },
  { en: "accomplish", ind: "menyelesaikan", cat: "Actions (Formal)", ex: "She accomplished all her goals." },
  { en: "obtain", ind: "memperoleh", cat: "Actions (Formal)", ex: "You need to obtain a permit first." },
  { en: "derive", ind: "memperoleh", cat: "Actions (Formal)", ex: "The word derives from Latin." },
  { en: "reveal", ind: "mengungkap", cat: "Actions (Formal)", ex: "The investigation revealed new evidence." },
  { en: "scatter", ind: "menyebarkan", cat: "Actions (Formal)", ex: "The wind scattered the leaves." },
  { en: "consider", ind: "mempertimbangkan", cat: "Actions (Formal)", ex: "Please consider my proposal." },

  // CLUSTER 4: Movement & Physical Actions
  { en: "stop over", ind: "singgah", cat: "Movement", ex: "We stopped over in Singapore." },
  { en: "tripping", ind: "tersandung", cat: "Movement", ex: "I kept tripping over the cables." },
  { en: "descend", ind: "turun", cat: "Movement", ex: "We descended the mountain carefully." },
  { en: "withdraw", ind: "menarik", cat: "Movement", ex: "She withdrew money from the ATM." },
  { en: "tilt", ind: "memiringkan", cat: "Movement", ex: "Tilt the camera slightly to the left." },
  { en: "advance", ind: "maju", cat: "Movement", ex: "The army advanced toward the city." },
  { en: "soar", ind: "melonjak", cat: "Movement", ex: "The eagle soared above the mountains." },
  { en: "fade", ind: "memudar", cat: "Movement", ex: "The colors faded in the sunlight." },
  { en: "stray", ind: "menyimpang", cat: "Movement", ex: "Don't stray from the main path." },
  { en: "spread", ind: "menyebar", cat: "Movement", ex: "The news spread quickly." },
  { en: "cascade", ind: "riam", cat: "Movement", ex: "Water cascaded down the rocks." },
  { en: "stick out", ind: "bertahan", cat: "Movement", ex: "His ears stick out a little." },
  { en: "stand steadily", ind: "berdiri mantap", cat: "Movement", ex: "She stood steadily despite the wind." },

  // CLUSTER 5: Thinking & Knowledge
  { en: "nescience", ind: "ketidaktahuan", cat: "Thinking", ex: "His nescience on the topic was clear." },
  { en: "tend", ind: "cenderung", cat: "Thinking", ex: "People tend to forget things." },
  { en: "tendency", ind: "kecenderungan", cat: "Thinking", ex: "There's a tendency to overthink." },
  { en: "obvious", ind: "jelas", cat: "Thinking", ex: "The answer was obvious to everyone." },
  { en: "evident", ind: "jelas", cat: "Thinking", ex: "It was evident that he was lying." },
  { en: "insight", ind: "wawasan", cat: "Thinking", ex: "The book provided great insight." },
  { en: "expertise", ind: "keahlian", cat: "Thinking", ex: "Her expertise in AI is well known." },
  { en: "sanity", ind: "kewarasan", cat: "Thinking", ex: "I questioned my own sanity." },
  { en: "suppose", ind: "memperkirakan", cat: "Thinking", ex: "I suppose you're right about that." },
  { en: "supposed", ind: "Seharusnya", cat: "Thinking", ex: "You're supposed to be here by 8." },
  { en: "imply", ind: "berarti", cat: "Thinking", ex: "What are you trying to imply?" },
  { en: "implies", ind: "menyiratkan", cat: "Thinking", ex: "This implies a deeper problem." },
  { en: "implied", ind: "tersirat", cat: "Thinking", ex: "The meaning was implied, not stated." },
  { en: "denotes", ind: "menunjukkan", cat: "Thinking", ex: "The red symbol denotes danger." },
  { en: "prove", ind: "membuktikan", cat: "Thinking", ex: "Can you prove your theory?" },
  { en: "proved", ind: "terbukti", cat: "Thinking", ex: "The method proved effective." },
  { en: "bear in mind", ind: "mengingat", cat: "Thinking", ex: "Bear in mind that deadlines are strict." },
  { en: "regard", ind: "pandangan", cat: "Thinking", ex: "In this regard, we must be careful." },

  // CLUSTER 6: Qualities & Descriptions (Positive)
  { en: "prosperous", ind: "makmur", cat: "Qualities (+)", ex: "Japan is a prosperous nation." },
  { en: "sufficient", ind: "memadai", cat: "Qualities (+)", ex: "We have sufficient resources." },
  { en: "versatile", ind: "serbaguna", cat: "Qualities (+)", ex: "She's a versatile musician." },
  { en: "essential", ind: "penting", cat: "Qualities (+)", ex: "Water is essential for life." },
  { en: "appropriate", ind: "sesuai", cat: "Qualities (+)", ex: "Wear appropriate clothing for the interview." },
  { en: "convenient", ind: "nyaman", cat: "Qualities (+)", ex: "The location is very convenient." },
  { en: "accomplished", ind: "ahli", cat: "Qualities (+)", ex: "She's an accomplished pianist." },
  { en: "lawful", ind: "sah", cat: "Qualities (+)", ex: "Is this action lawful?" },
  { en: "snug", ind: "nyaman", cat: "Qualities (+)", ex: "The baby was snug in her blanket." },
  { en: "plenty", ind: "banyak", cat: "Qualities (+)", ex: "There's plenty of food for everyone." },
  { en: "tidy", ind: "rapi", cat: "Qualities (+)", ex: "Keep your room tidy." },
  { en: "distinct", ind: "berbeda", cat: "Qualities (+)", ex: "There are two distinct categories." },

  // CLUSTER 7: Qualities & Descriptions (Negative)
  { en: "vulnerable", ind: "rentan", cat: "Qualities (-)", ex: "Children are vulnerable to diseases." },
  { en: "susceptible", ind: "rentan", cat: "Qualities (-)", ex: "He's susceptible to colds." },
  { en: "prone", ind: "rentan", cat: "Qualities (-)", ex: "She's prone to making mistakes." },
  { en: "reckless", ind: "ceroboh", cat: "Qualities (-)", ex: "Reckless driving causes accidents." },
  { en: "slovenly", ind: "jorok", cat: "Qualities (-)", ex: "His slovenly appearance shocked everyone." },
  { en: "blunt", ind: "tumpul", cat: "Qualities (-)", ex: "The knife was too blunt to cut." },
  { en: "brittle", ind: "rapuh", cat: "Qualities (-)", ex: "Old bones become brittle." },
  { en: "tedious", ind: "membosankan", cat: "Qualities (-)", ex: "The lecture was tedious." },
  { en: "rude", ind: "kasar", cat: "Qualities (-)", ex: "It's rude to interrupt people." },
  { en: "tough", ind: "keras", cat: "Qualities (-)", ex: "The steak was really tough." },
  { en: "insufficient", ind: "tidak memadai", cat: "Qualities (-)", ex: "The evidence was insufficient." },
  { en: "odd", ind: "aneh", cat: "Qualities (-)", ex: "That's an odd thing to say." },
  { en: "restricted", ind: "terbatas", cat: "Qualities (-)", ex: "Access is restricted to members only." },
  { en: "finite", ind: "terbatas", cat: "Qualities (-)", ex: "Our resources are finite." },

  // CLUSTER 8: Social & Relationships
  { en: "tribe", ind: "suku", cat: "Social", ex: "The tribe lived in the forest." },
  { en: "dispute", ind: "sengketa", cat: "Social", ex: "They had a dispute over land." },
  { en: "favor", ind: "kebaikan", cat: "Social", ex: "Can you do me a favor?" },
  { en: "dork", ind: "orang tolol", cat: "Social", ex: "Don't be such a dork!" },
  { en: "lunatic", ind: "gila", cat: "Social", ex: "He drives like a lunatic." },
  { en: "mess", ind: "kekacauan", cat: "Social", ex: "My room is such a mess." },
  { en: "foreigner", ind: "orang asing", cat: "Social", ex: "As a foreigner, she felt lonely." },
  { en: "maid", ind: "pembantu", cat: "Social", ex: "The maid cleaned the room." },
  { en: "simp", ind: "orang bodoh", cat: "Social", ex: "Don't be a simp for someone who doesn't care." },
  { en: "crowd", ind: "kerumunan", cat: "Social", ex: "The crowd cheered loudly." },
  { en: "orator", ind: "ahli pidato", cat: "Social", ex: "He's a gifted orator." },
  { en: "role", ind: "peran", cat: "Social", ex: "What's your role in the project?" },
  { en: "sacrifice", ind: "pengorbanan", cat: "Social", ex: "Parents make sacrifices for their children." },
  { en: "owe", ind: "utang", cat: "Social", ex: "I owe you twenty dollars." },
  { en: "curse", ind: "kutukan", cat: "Social", ex: "The old woman put a curse on him." },
  { en: "stingy", ind: "pelit", cat: "Social", ex: "He's too stingy to buy lunch." },

  // CLUSTER 9: Work & Professional
  { en: "occupation", ind: "pekerjaan", cat: "Work", ex: "What's your occupation?" },
  { en: "compulsory", ind: "wajib", cat: "Work", ex: "Education is compulsory until age 16." },
  { en: "conscripted", ind: "wajib militer", cat: "Work", ex: "Young men were conscripted into the army." },
  { en: "labor", ind: "tenaga kerja", cat: "Work", ex: "There's a shortage of skilled labor." },
  { en: "shortage", ind: "kekurangan", cat: "Work", ex: "There's a food shortage in the region." },
  { en: "gig", ind: "dokar", cat: "Work", ex: "He got a gig as a freelance designer." },
  { en: "tycoon", ind: "raja", cat: "Work", ex: "The oil tycoon bought another mansion." },
  { en: "idle", ind: "diam", cat: "Work", ex: "The machines sat idle all day." },
  { en: "rely", ind: "mengandalkan", cat: "Work", ex: "You can rely on me." },
  { en: "relies", ind: "mengandalkan", cat: "Work", ex: "The company relies on innovation." },
  { en: "prompt", ind: "mengingatkan", cat: "Work", ex: "What prompted you to apply?" },
  { en: "prompted", ind: "diminta", cat: "Work", ex: "He was prompted to explain further." },
  { en: "settle", ind: "menetap", cat: "Work", ex: "They settled in a small town." },
  { en: "heading", ind: "menuju", cat: "Work", ex: "We're heading toward success." },

  // CLUSTER 10: Nature & Physical World
  { en: "seaweed", ind: "rumput laut", cat: "Nature", ex: "Seaweed is popular in Japanese cuisine." },
  { en: "moth", ind: "ngengat", cat: "Nature", ex: "A moth flew into the light." },
  { en: "roots", ind: "akar", cat: "Nature", ex: "The tree has deep roots." },
  { en: "twig", ind: "ranting", cat: "Nature", ex: "The bird sat on a thin twig." },
  { en: "leaves", ind: "Daun", cat: "Nature", ex: "Autumn leaves turned golden." },
  { en: "bushes", ind: "semak-semak", cat: "Nature", ex: "The cat hid in the bushes." },
  { en: "branch", ind: "cabang", cat: "Nature", ex: "A branch broke off the tree." },
  { en: "thorny", ind: "berduri", cat: "Nature", ex: "Be careful of thorny plants." },
  { en: "furry", ind: "berbulu", cat: "Nature", ex: "The furry kitten was adorable." },
  { en: "slope", ind: "lereng", cat: "Nature", ex: "We climbed up the steep slope." },
  { en: "spark", ind: "percikan", cat: "Nature", ex: "A spark started the forest fire." },

  // CLUSTER 11: Objects & Things
  { en: "pack mule", ind: "keledai pengangkut barang", cat: "Objects", ex: "The pack mule carried supplies up the mountain." },
  { en: "strut", ind: "topangan", cat: "Objects", ex: "The strut supports the roof." },
  { en: "cushion", ind: "bantalan", cat: "Objects", ex: "Sit on this cushion." },
  { en: "stitch", ind: "jahitan", cat: "Objects", ex: "The doctor put three stitches in." },
  { en: "bench", ind: "bangku", cat: "Objects", ex: "Let's sit on that bench." },
  { en: "vise", ind: "ragum", cat: "Objects", ex: "Clamp it in the vise." },
  { en: "blanket", ind: "selimut", cat: "Objects", ex: "She pulled the blanket over her head." },
  { en: "jar", ind: "stoples", cat: "Objects", ex: "Pass me the cookie jar." },
  { en: "mats", ind: "tikar", cat: "Objects", ex: "Wipe your feet on the mat." },
  { en: "stain", ind: "noda", cat: "Objects", ex: "There's a coffee stain on my shirt." },
  { en: "wedge", ind: "baji", cat: "Objects", ex: "Use a wedge to keep the door open." },
  { en: "slit", ind: "celah", cat: "Objects", ex: "Light came through the slit." },
  { en: "log", ind: "catatan", cat: "Objects", ex: "Check the log for errors." },
  { en: "a sink", ind: "wastafel", cat: "Objects", ex: "Wash your hands in the sink." },
  { en: "tub", ind: "bak mandi", cat: "Objects", ex: "Fill the tub with warm water." },
  { en: "fender", ind: "spakbor", cat: "Objects", ex: "The car's fender was dented." },
  { en: "nostril", ind: "lubang hidung", cat: "Objects", ex: "Breathe through your nostrils." },
  { en: "fortress", ind: "benteng", cat: "Objects", ex: "The ancient fortress still stands." },
  { en: "court", ind: "pengadilan", cat: "Objects", ex: "The case went to court." },
  { en: "graves", ind: "kuburan", cat: "Objects", ex: "They visited the old graves." },
  { en: "hinge", ind: "engsel", cat: "Objects", ex: "The door hinge is rusty." },

  // CLUSTER 12: Connectors & Grammar Words
  { en: "although", ind: "meskipun", cat: "Connectors", ex: "Although it rained, we went out." },
  { en: "though", ind: "meskipun", cat: "Connectors", ex: "I like it, though it's expensive." },
  { en: "despite", ind: "meskipun", cat: "Connectors", ex: "Despite the rain, we continued." },
  { en: "however", ind: "Namun", cat: "Connectors", ex: "However, the results were unexpected." },
  { en: "moreover", ind: "lebih-lebih lagi", cat: "Connectors", ex: "Moreover, costs have increased." },
  { en: "furthermore", ind: "lebih-lebih lagi", cat: "Connectors", ex: "Furthermore, we need more data." },
  { en: "hence", ind: "karena itu", cat: "Connectors", ex: "He was tired, hence the mistakes." },
  { en: "therefore", ind: "karena itu", cat: "Connectors", ex: "Therefore, we must act now." },
  { en: "accordingly", ind: "demikian", cat: "Connectors", ex: "Plan accordingly for bad weather." },
  { en: "nor", ind: "juga bukan", cat: "Connectors", ex: "Neither he nor I was invited." },
  { en: "instead", ind: "sebagai gantinya", cat: "Connectors", ex: "Let's walk instead of driving." },
  { en: "besides", ind: "selain", cat: "Connectors", ex: "Besides English, she speaks French." },
  { en: "in order to", ind: "untuk", cat: "Connectors", ex: "We study in order to learn." },
  { en: "whether", ind: "apakah", cat: "Connectors", ex: "I wonder whether he'll come." },
  { en: "at least", ind: "paling sedikit", cat: "Connectors", ex: "At least try your best." },
  { en: "some", ind: "beberapa", cat: "Connectors", ex: "Some people prefer tea." },
  { en: "merely", ind: "hanya", cat: "Connectors", ex: "He merely smiled and walked away." },
  { en: "entirely", ind: "sepenuhnya", cat: "Connectors", ex: "That's entirely up to you." },
  { en: "essentially", ind: "pada dasarnya", cat: "Connectors", ex: "They're essentially the same thing." },
  { en: "slightly", ind: "agak", cat: "Connectors", ex: "The temperature dropped slightly." },
  { en: "foremost", ind: "terutama", cat: "Connectors", ex: "First and foremost, stay safe." },
  { en: "apart", ind: "terpisah", cat: "Connectors", ex: "Keep the two groups apart." },
  { en: "further", ind: "lebih jauh", cat: "Connectors", ex: "We need to investigate further." },

  // CLUSTER 13: Change & Process
  { en: "recurring", ind: "berulang", cat: "Change", ex: "It's a recurring problem." },
  { en: "sustain", ind: "mempertahankan", cat: "Change", ex: "We must sustain this momentum." },
  { en: "retain", ind: "mempertahankan", cat: "Change", ex: "Try to retain the information." },
  { en: "remain", ind: "tetap", cat: "Change", ex: "Please remain seated." },
  { en: "prevent", ind: "mencegah", cat: "Change", ex: "Vaccines prevent diseases." },
  { en: "impede", ind: "menghalangi", cat: "Change", ex: "Bad weather impeded our progress." },
  { en: "restrict", ind: "membatasi", cat: "Change", ex: "We must restrict access." },
  { en: "enable", ind: "memungkinkan", cat: "Change", ex: "Technology enables communication." },
  { en: "enhance", ind: "menambah", cat: "Change", ex: "Music enhances the atmosphere." },
  { en: "improve", ind: "memperbaiki", cat: "Change", ex: "We need to improve our process." },
  { en: "extend", ind: "memperpanjang", cat: "Change", ex: "Can we extend the deadline?" },
  { en: "yield", ind: "menghasilkan", cat: "Change", ex: "The farm yields good crops." },
  { en: "rid", ind: "menyingkirkan", cat: "Change", ex: "Get rid of the old furniture." },
  { en: "exceed", ind: "melebihi", cat: "Change", ex: "Sales exceeded expectations." },
  { en: "arise", ind: "timbul", cat: "Change", ex: "Problems may arise unexpectedly." },
  { en: "behave", ind: "berperilaku baik", cat: "Change", ex: "Please behave in class." },
  { en: "sow", ind: "menabur", cat: "Change", ex: "You reap what you sow." },
  { en: "reap", ind: "menuai", cat: "Change", ex: "He reaped the benefits of hard work." },
  { en: "grind", ind: "menggiling", cat: "Change", ex: "Grind the coffee beans first." },
  { en: "shear", ind: "mencukur", cat: "Change", ex: "They sheared the sheep in spring." },
  { en: "concatenate", ind: "menggabungkan", cat: "Change", ex: "Concatenate the two strings." },
  { en: "tighten", ind: "mengencangkan", cat: "Change", ex: "Tighten the bolts carefully." },
  { en: "separate", ind: "memisahkan", cat: "Change", ex: "Separate the whites from the yolks." },
  { en: "summarise", ind: "meringkaskan", cat: "Change", ex: "Can you summarise the main points?" },

  // CLUSTER 14: Effort & Persistence
  { en: "endeavor", ind: "berusaha keras", cat: "Effort", ex: "We must endeavor to do better." },
  { en: "desire", ind: "menginginkan", cat: "Effort", ex: "She desires a peaceful life." },
  { en: "intend", ind: "bermaksud", cat: "Effort", ex: "I intend to finish by Friday." },
  { en: "advisable", ind: "sebaiknya", cat: "Effort", ex: "It's advisable to book early." },
  { en: "advise", ind: "menasihati", cat: "Effort", ex: "I advise you to reconsider." },
  { en: "oppose", ind: "menolak", cat: "Effort", ex: "Many people oppose the new law." },
  { en: "depend", ind: "bergantung", cat: "Effort", ex: "It depends on the weather." },
  { en: "correspond", ind: "sesuai", cat: "Effort", ex: "The results correspond to our predictions." },
  { en: "fetch", ind: "mengambil", cat: "Effort", ex: "Can you fetch my glasses?" },
  { en: "hand out", ind: "membagikan", cat: "Effort", ex: "Hand out the worksheets please." },
  { en: "attach", ind: "menempel", cat: "Effort", ex: "Attach the file to the email." },

  // CLUSTER 15: Measurement & Technical
  { en: "tensile", ind: "tarik", cat: "Technical", ex: "The tensile strength of steel is high." },
  { en: "algebraic", ind: "aljabar", cat: "Technical", ex: "Solve the algebraic equation." },
  { en: "mensuration", ind: "pengukuran", cat: "Technical", ex: "Mensuration deals with measuring." },
  { en: "strain", ind: "tekanan", cat: "Technical", ex: "The strain on the bridge was huge." },
  { en: "tension", ind: "ketegangan", cat: "Technical", ex: "There's tension in the rope." },
  { en: "magnitude", ind: "besarnya", cat: "Technical", ex: "The magnitude of the earthquake was 7.0." },
  { en: "perpendicular", ind: "tegak lurus", cat: "Technical", ex: "Draw a perpendicular line." },
  { en: "lateral", ind: "lateral", cat: "Technical", ex: "Apply lateral pressure." },
  { en: "longitudinal", ind: "membujur", cat: "Technical", ex: "A longitudinal study takes years." },
  { en: "taper", ind: "lancip", cat: "Technical", ex: "The column tapers toward the top." },
  { en: "protrusion", ind: "tonjolan", cat: "Technical", ex: "Watch out for the protrusion." },
  { en: "orifice", ind: "lubang", cat: "Technical", ex: "The orifice was blocked." },
  { en: "lump", ind: "gumpalan", cat: "Technical", ex: "There's a lump in the mixture." },
  { en: "chunk", ind: "bingkah", cat: "Technical", ex: "Break it into smaller chunks." },
  { en: "stress", ind: "menekankan", cat: "Technical", ex: "I must stress the importance of safety." },
  { en: "completion", ind: "penyelesaian", cat: "Technical", ex: "The project is near completion." },
  { en: "prerequisite", ind: "prasyarat", cat: "Technical", ex: "Math 101 is a prerequisite." },
  { en: "canonical", ind: "Resmi", cat: "Technical", ex: "This is the canonical version." },
  { en: "void setup", ind: "kekosongan pengaturan", cat: "Technical", ex: "void setup() runs once in Arduino." },
  { en: "slash", ind: "memotong", cat: "Technical", ex: "Use a forward slash in URLs." },
  { en: "slashes", ind: "garis miring", cat: "Technical", ex: "Two slashes start a comment." },
  { en: "tally", ind: "menghitung", cat: "Technical", ex: "Let's tally up the votes." },
  { en: "spread", ind: "sebaran", cat: "Technical", ex: "The spread of data is wide." },
  { en: "trace", ind: "jejak", cat: "Technical", ex: "We can trace the signal." },
  { en: "trail", ind: "jejak", cat: "Technical", ex: "Follow the trail through the woods." },
  { en: "trailing", ind: "tertinggal", cat: "Technical", ex: "Remove trailing whitespace." },

  // CLUSTER 16: Law & Society
  { en: "convenant", ind: "perjanjian", cat: "Law & Society", ex: "They signed a covenant of peace." },
  { en: "preaching", ind: "khotbah", cat: "Law & Society", ex: "Stop preaching and just listen." },
  { en: "virtue", ind: "kebajikan", cat: "Law & Society", ex: "Patience is a virtue." },
  { en: "sin", ind: "dosa", cat: "Law & Society", ex: "Greed is considered a sin." },
  { en: "bounty", ind: "karunia", cat: "Law & Society", ex: "Nature's bounty feeds us all." },
  { en: "curfew", ind: "jam malam", cat: "Law & Society", ex: "The curfew starts at 10 PM." },
  { en: "embassy", ind: "kedutaan", cat: "Law & Society", ex: "Go to the embassy for your visa." },
  { en: "overseas", ind: "luar negeri", cat: "Law & Society", ex: "She works overseas." },
  { en: "airfare", ind: "tiket pesawat", cat: "Law & Society", ex: "Airfare to Europe is expensive." },
  { en: "expense", ind: "pengeluaran", cat: "Law & Society", ex: "Travel is a big expense." },
  { en: "precaution", ind: "pencegahan", cat: "Law & Society", ex: "Take precautions against the virus." },
  { en: "circumstance", ind: "keadaan", cat: "Law & Society", ex: "Under the circumstances, we had no choice." },
  { en: "circumstances", ind: "keadaan", cat: "Law & Society", ex: "Circumstances have changed." },
  { en: "arrangements", ind: "pengaturan", cat: "Law & Society", ex: "We made arrangements for the trip." },
  { en: "occasion", ind: "kesempatan", cat: "Law & Society", ex: "It was a special occasion." },
  { en: "foster", ind: "mengasuh", cat: "Law & Society", ex: "They foster children in need." },
  { en: "unintentional", ind: "tak disengaja", cat: "Law & Society", ex: "The damage was unintentional." },
  { en: "honors", ind: "kehormatan", cat: "Law & Society", ex: "She graduated with honors." },
  { en: "awards", ind: "penghargaan", cat: "Law & Society", ex: "The film won several awards." },
  { en: "constituent", ind: "unsur", cat: "Law & Society", ex: "Hydrogen is a constituent of water." },
  { en: "disaster", ind: "bencana", cat: "Law & Society", ex: "The earthquake was a disaster." },
  { en: "catastrophic", ind: "bencana", cat: "Law & Society", ex: "The damage was catastrophic." },
  { en: "unfortunate", ind: "disayangkan", cat: "Law & Society", ex: "It was an unfortunate accident." },

  // CLUSTER 17: Body & Health
  { en: "sneezing", ind: "bersin", cat: "Body & Health", ex: "I keep sneezing because of allergies." },
  { en: "yawn", ind: "menguap", cat: "Body & Health", ex: "He tried to suppress a yawn." },
  { en: "cough", ind: "batuk", cat: "Body & Health", ex: "Cover your mouth when you cough." },
  { en: "headbutts", ind: "sundulan kepala", cat: "Body & Health", ex: "The player was penalized for headbutts." },
  { en: "conceived", ind: "dikandung", cat: "Body & Health", ex: "The baby was conceived in spring." },
  { en: "ingest", ind: "menelan", cat: "Body & Health", ex: "Do not ingest this chemical." },
  { en: "vowel", ind: "vokal", cat: "Language", ex: "English has five vowel letters." },
  { en: "plural", ind: "Jamak", cat: "Language", ex: "The plural of 'child' is 'children'." },
  { en: "prefix", ind: "awalan", cat: "Language", ex: "'Un-' is a common prefix." },

  // CLUSTER 18: Spatial & Physical Properties
  { en: "tight", ind: "ketat", cat: "Spatial", ex: "The lid is too tight to open." },
  { en: "attached", ind: "melekat", cat: "Spatial", ex: "The tag is attached to the bag." },
  { en: "bear", ind: "menanggung", cat: "Spatial", ex: "I can't bear the heat." },
  { en: "borne", ind: "ditanggung", cat: "Spatial", ex: "The cost will be borne by the company." },
  { en: "separation", ind: "pemisahan", cat: "Spatial", ex: "The separation was painful." },
  { en: "struck", ind: "dihantam", cat: "Spatial", ex: "Lightning struck the tower." },
  { en: "sparsely", ind: "jarang", cat: "Spatial", ex: "The area is sparsely populated." },
  { en: "vastness", ind: "keluasan", cat: "Spatial", ex: "The vastness of the ocean amazed them." },

  // CLUSTER 19: Miscellaneous/Slang
  { en: "aite", ind: "tunggu sebentar", cat: "Slang", ex: "Aite, let me check that for you." },
  { en: "nope", ind: "Tidak", cat: "Slang", ex: "Nope, I'm not going." },
  { en: "dope", ind: "bagus sekali", cat: "Slang", ex: "That trick was dope!" },
  { en: "kinda", ind: "agak", cat: "Slang", ex: "I'm kinda tired right now." },
  { en: "kind of", ind: "agak", cat: "Slang", ex: "It's kind of complicated." },
  { en: "craze", ind: "menggila", cat: "Slang", ex: "The new game became a craze." },
  { en: "simping", ind: "penyederhanaan", cat: "Slang", ex: "Stop simping over celebrities." },
  { en: "a void", ind: "menghindari", cat: "Slang", ex: "Avoid the void in conversation." },
  { en: "void", ind: "ruang kosong", cat: "Slang", ex: "The void between stars is vast." },

  // CLUSTER 20: Abstract Concepts
  { en: "flaw", ind: "kekurangan", cat: "Abstract", ex: "Every plan has a flaw." },
  { en: "disadvantage", ind: "kerugian", cat: "Abstract", ex: "The main disadvantage is the cost." },
  { en: "advantage", ind: "keuntungan", cat: "Abstract", ex: "Speed is our main advantage." },
  { en: "convenience", ind: "kenyamanan", cat: "Abstract", ex: "Online shopping offers convenience." },
  { en: "dependency", ind: "Ketergantungan", cat: "Abstract", ex: "Reduce your dependency on caffeine." },
  { en: "enhancement", ind: "peningkatan", cat: "Abstract", ex: "The enhancement improved performance." },
  { en: "extension", ind: "perpanjangan", cat: "Abstract", ex: "I need an extension on the deadline." },
  { en: "certain", ind: "yakin", cat: "Abstract", ex: "I'm certain this is correct." },
  { en: "entire", ind: "seluruh", cat: "Abstract", ex: "The entire team agreed." },
  { en: "suit", ind: "setelan", cat: "Abstract", ex: "He wore a dark suit." },
  { en: "suited", ind: "cocok", cat: "Abstract", ex: "She's well suited for the job." },
  { en: "way", ind: "cara", cat: "Abstract", ex: "There's always a better way." },
  { en: "term", ind: "ketentuan", cat: "Abstract", ex: "Read the terms and conditions." },
  { en: "thread", ind: "benang", cat: "Abstract", ex: "Follow the thread of the argument." },
  { en: "toward", ind: "ke arah", cat: "Abstract", ex: "Walk toward the light." },
  { en: "against", ind: "melawan", cat: "Abstract", ex: "We fought against injustice." },
  { en: "beforehand", ind: "sebelumnya", cat: "Abstract", ex: "Please call beforehand." },
  { en: "unified", ind: "bersatu", cat: "Abstract", ex: "A unified team is stronger." },
  { en: "involved", ind: "terlibat", cat: "Abstract", ex: "Don't get involved in drama." },
  { en: "involve", ind: "melibatkan", cat: "Abstract", ex: "This will involve extra work." },
  { en: "involving", ind: "melibatkan", cat: "Abstract", ex: "Tasks involving math are hard." },
  { en: "pertains", ind: "berkaitan", cat: "Abstract", ex: "This pertains to your request." },
  { en: "examined", ind: "diperiksa", cat: "Abstract", ex: "The patient was examined by a doctor." },
  { en: "established", ind: "didirikan", cat: "Abstract", ex: "The school was established in 1900." },
  { en: "act", ind: "bertindak", cat: "Abstract", ex: "We need to act fast." },
  { en: "soliciting", ind: "Meminta", cat: "Abstract", ex: "She's soliciting donations." },
  { en: "solicit", ind: "Mengumpulkan", cat: "Abstract", ex: "They solicited opinions from everyone." },
  { en: "compliant", ind: "sesuai", cat: "Abstract", ex: "The system is now compliant." },
  { en: "corresponding", ind: "sesuai", cat: "Abstract", ex: "Find the corresponding page." },
  { en: "derived", ind: "berasal dari", cat: "Abstract", ex: "The word is derived from Greek." },
  { en: "hands-on", ind: "tangan di atas", cat: "Abstract", ex: "Get hands-on experience." },
  { en: "sanely", ind: "secara masuk akal", cat: "Abstract", ex: "Think sanely about this issue." },
  { en: "weakly", ind: "dengan lemah", cat: "Abstract", ex: "He weakly raised his hand." },
  { en: "contrail", ind: "jejak", cat: "Abstract", ex: "The plane left a contrail in the sky." },
  { en: "advent", ind: "kedatangan", cat: "Abstract", ex: "The advent of the internet changed everything." },
  { en: "query", ind: "pertanyaan", cat: "Abstract", ex: "Submit a query to the database." },
  { en: "least", ind: "paling sedikit", cat: "Abstract", ex: "That's the least I can do." },

  // Additional items
  { en: "e.g.", ind: "misalnya", cat: "Language", ex: "Use connectors, e.g., however and therefore." },
  { en: "exempli gratia", ind: "Misalnya", cat: "Language", ex: "Exempli gratia is the Latin form of e.g." },
  { en: "et cetera", ind: "dll.", cat: "Language", ex: "Bring pens, pencils, et cetera." },
  { en: "arbitrary", ind: "sewenang-wenang", cat: "Abstract", ex: "The decision seemed arbitrary." },
  { en: "exerted", ind: "dikerahkan", cat: "Actions (Formal)", ex: "Great effort was exerted." },
  { en: "inherit", ind: "mewarisi", cat: "Abstract", ex: "She will inherit the estate." },
  { en: "one term", ind: "satu istilah", cat: "Language", ex: "Define it in one term." },
  { en: "frantically", ind: "dengan panik", cat: "Emotions & Feelings", ex: "She frantically searched for her keys." },
];

// ============================================================
// CATEGORIES with colors
// ============================================================
const CATEGORY_COLORS = {
  "Emotions & Feelings": { bg: "#FEE2E2", accent: "#DC2626", dark: "#991B1B" },
  "Beliefs & Values": { bg: "#FEF3C7", accent: "#D97706", dark: "#92400E" },
  "Actions (Daily)": { bg: "#DBEAFE", accent: "#2563EB", dark: "#1E40AF" },
  "Actions (Formal)": { bg: "#E0E7FF", accent: "#4F46E5", dark: "#3730A3" },
  "Movement": { bg: "#D1FAE5", accent: "#059669", dark: "#065F46" },
  "Thinking": { bg: "#F3E8FF", accent: "#7C3AED", dark: "#5B21B6" },
  "Qualities (+)": { bg: "#ECFDF5", accent: "#10B981", dark: "#047857" },
  "Qualities (-)": { bg: "#FFF1F2", accent: "#F43F5E", dark: "#BE123C" },
  "Social": { bg: "#FFF7ED", accent: "#EA580C", dark: "#C2410C" },
  "Work": { bg: "#F0F9FF", accent: "#0284C7", dark: "#075985" },
  "Nature": { bg: "#F0FDF4", accent: "#16A34A", dark: "#166534" },
  "Objects": { bg: "#FDF4FF", accent: "#C026D3", dark: "#86198F" },
  "Connectors": { bg: "#F8FAFC", accent: "#475569", dark: "#1E293B" },
  "Change": { bg: "#FEF9C3", accent: "#CA8A04", dark: "#854D0E" },
  "Effort": { bg: "#CCFBF1", accent: "#0D9488", dark: "#115E59" },
  "Technical": { bg: "#E2E8F0", accent: "#64748B", dark: "#334155" },
  "Law & Society": { bg: "#FCE7F3", accent: "#DB2777", dark: "#9D174D" },
  "Body & Health": { bg: "#FFE4E6", accent: "#E11D48", dark: "#9F1239" },
  "Language": { bg: "#EDE9FE", accent: "#8B5CF6", dark: "#6D28D9" },
  "Spatial": { bg: "#E0F2FE", accent: "#0EA5E9", dark: "#0369A1" },
  "Slang": { bg: "#FEF08A", accent: "#EAB308", dark: "#A16207" },
  "Abstract": { bg: "#F1F5F9", accent: "#6366F1", dark: "#4338CA" },
};

// ============================================================
// SRS (Leitner System) Logic
// ============================================================
const SRS_INTERVALS = [0, 1, 3, 7, 14, 30, 60]; // days

function getInitialSRS() {
  const now = Date.now();
  return RAW_VOCAB.map((item, i) => ({
    ...item,
    uid: i,
    box: 0,
    nextReview: now,
    lastReview: null,
    correctStreak: 0,
    totalAttempts: 0,
    totalCorrect: 0,
  }));
}

// ============================================================
// MAIN APP
// ============================================================
export default function VocabMasterApp() {
  const [vocab, setVocab] = useState(getInitialSRS);
  const [view, setView] = useState("home"); // home, learn, review, browse, stats
  const [selectedCat, setSelectedCat] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [mode, setMode] = useState("id-to-en"); // id-to-en (production) or en-to-id (recognition)
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0, total: 0 });
  const [reviewQueue, setReviewQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [retypeInput, setRetypeInput] = useState("");
  const [retypeConfirmed, setRetypeConfirmed] = useState(false);
  const inputRef = useRef(null);
  const retypeRef = useRef(null);

  // Load saved progress
  useEffect(() => {
    try {
      const saved = window._vocabProgress;
      if (saved) {
        setVocab(saved);
      }
    } catch (e) {}
  }, []);

  // Save progress
  useEffect(() => {
    window._vocabProgress = vocab;
  }, [vocab]);

  const categories = [...new Set(RAW_VOCAB.map(v => v.cat))];

  const getDueCards = useCallback(() => {
    const now = Date.now();
    return vocab.filter(v => v.nextReview <= now).sort((a, b) => a.box - b.box);
  }, [vocab]);

  const getCategoryCards = useCallback((cat) => {
    return vocab.filter(v => v.cat === cat);
  }, [vocab]);

  const startReview = (cards) => {
    if (cards.length === 0) return;
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setReviewQueue(shuffled);
    setQueueIndex(0);
    setCurrentCard(shuffled[0]);
    setShowAnswer(false);
    setUserInput("");
    setFeedback(null);
    setSessionStats({ correct: 0, wrong: 0, total: 0 });
    setRetypeInput("");
    setRetypeConfirmed(false);
    setView("review");
  };

  const startCategoryLearn = (cat) => {
    setSelectedCat(cat);
    const cards = getCategoryCards(cat);
    startReview(cards);
  };

  const checkAnswer = () => {
    if (!currentCard || !userInput.trim()) return;
    const target = mode === "id-to-en" ? currentCard.en : currentCard.ind;
    const answer = userInput.trim().toLowerCase();
    const correct = target.toLowerCase();
    
    const isCorrect = answer === correct || 
      correct.includes(answer) || 
      answer.includes(correct) ||
      levenshtein(answer, correct) <= Math.max(1, Math.floor(correct.length * 0.2));

    setFeedback({ isCorrect, correctAnswer: target });
    setShowAnswer(true);
    setRetypeInput("");
    setRetypeConfirmed(false);

    setVocab(prev => prev.map(v => {
      if (v.uid !== currentCard.uid) return v;
      const newBox = isCorrect ? Math.min(v.box + 1, 6) : Math.max(v.box - 1, 0);
      const interval = SRS_INTERVALS[newBox] * 24 * 60 * 60 * 1000;
      return {
        ...v,
        box: newBox,
        nextReview: Date.now() + interval,
        lastReview: Date.now(),
        correctStreak: isCorrect ? v.correctStreak + 1 : 0,
        totalAttempts: v.totalAttempts + 1,
        totalCorrect: v.totalCorrect + (isCorrect ? 1 : 0),
      };
    }));

    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
      total: prev.total + 1,
    }));
  };

  const nextCard = () => {
    const nextIdx = queueIndex + 1;
    if (nextIdx >= reviewQueue.length) {
      setView("results");
      return;
    }
    setQueueIndex(nextIdx);
    setCurrentCard(reviewQueue[nextIdx]);
    setShowAnswer(false);
    setUserInput("");
    setFeedback(null);
    setRetypeInput("");
    setRetypeConfirmed(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const checkRetype = () => {
    if (!feedback?.correctAnswer || !retypeInput.trim()) return;
    const typed = retypeInput.trim().toLowerCase();
    const correct = feedback.correctAnswer.toLowerCase();
    const isMatch = typed === correct ||
      levenshtein(typed, correct) <= Math.max(1, Math.floor(correct.length * 0.15));
    if (isMatch) {
      setRetypeConfirmed(true);
    } else {
      setRetypeInput("");
      if (retypeRef.current) {
        retypeRef.current.style.borderColor = "#DC2626";
        setTimeout(() => { if (retypeRef.current) retypeRef.current.style.borderColor = "#334155"; }, 600);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!showAnswer) {
        checkAnswer();
      } else if (showAnswer && feedback?.isCorrect) {
        nextCard();
      } else if (showAnswer && !feedback?.isCorrect && !retypeConfirmed) {
        checkRetype();
      } else if (showAnswer && retypeConfirmed) {
        nextCard();
      }
    }
  };

  // Levenshtein distance for fuzzy matching
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[m][n];
  }

  // Stats calculations
  const totalMastered = vocab.filter(v => v.box >= 4).length;
  const totalLearning = vocab.filter(v => v.box > 0 && v.box < 4).length;
  const totalNew = vocab.filter(v => v.box === 0).length;
  const dueNow = getDueCards().length;

  // ============================================================
  // RENDER
  // ============================================================

  // Results Screen
  if (view === "results") {
    const pct = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#F8FAFC", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{pct >= 80 ? "🔥" : pct >= 50 ? "💪" : "📚"}</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Session Complete!</h1>
          <p style={{ color: "#94A3B8", fontSize: 16, marginBottom: 32 }}>
            {pct >= 80 ? "Excellent work! Keep it up!" : pct >= 50 ? "Good progress! Practice makes perfect." : "Keep practicing, you'll get better!"}
          </p>
          
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40 }}>
            <div style={{ background: "#065F46", borderRadius: 16, padding: "20px 28px" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#34D399" }}>{sessionStats.correct}</div>
              <div style={{ fontSize: 13, color: "#6EE7B7" }}>Correct</div>
            </div>
            <div style={{ background: "#991B1B", borderRadius: 16, padding: "20px 28px" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#FCA5A5" }}>{sessionStats.wrong}</div>
              <div style={{ fontSize: 13, color: "#FECACA" }}>Wrong</div>
            </div>
            <div style={{ background: "#1E3A5F", borderRadius: 16, padding: "20px 28px" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#93C5FD" }}>{pct}%</div>
              <div style={{ fontSize: 13, color: "#BFDBFE" }}>Score</div>
            </div>
          </div>

          <button onClick={() => setView("home")} style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#FFF", border: "none", borderRadius: 14, padding: "16px 40px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Review Screen
  if (view === "review" && currentCard) {
    const question = mode === "id-to-en" ? currentCard.ind : currentCard.en;
    const answer = mode === "id-to-en" ? currentCard.en : currentCard.ind;
    const catColor = CATEGORY_COLORS[currentCard.cat] || CATEGORY_COLORS["Abstract"];
    const progress = ((queueIndex + 1) / reviewQueue.length) * 100;

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#F8FAFC", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <button onClick={() => setView("home")} style={{ background: "#334155", border: "none", color: "#94A3B8", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
              ← Exit
            </button>
            <span style={{ color: "#94A3B8", fontSize: 14, fontFamily: "'DM Mono', monospace" }}>
              {queueIndex + 1} / {reviewQueue.length}
            </span>
            <button onClick={() => setMode(m => m === "id-to-en" ? "en-to-id" : "id-to-en")} style={{ background: "#334155", border: "none", color: "#94A3B8", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
              {mode === "id-to-en" ? "🇮🇩→🇬🇧" : "🇬🇧→🇮🇩"}
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: "#1E293B", borderRadius: 2, marginBottom: 32, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #6366F1, #8B5CF6)", borderRadius: 2, transition: "width 0.3s ease" }} />
          </div>

          {/* Category tag */}
          <div style={{ display: "inline-block", background: catColor.bg + "22", border: `1px solid ${catColor.accent}44`, borderRadius: 8, padding: "4px 12px", marginBottom: 24 }}>
            <span style={{ fontSize: 12, color: catColor.accent, fontWeight: 600 }}>{currentCard.cat}</span>
          </div>

          {/* Question */}
          <div style={{ background: "#1E293B", borderRadius: 20, padding: "32px 24px", marginBottom: 24, border: "1px solid #334155" }}>
            <div style={{ fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              {mode === "id-to-en" ? "Translate to English" : "Translate to Indonesian"}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#F1F5F9", lineHeight: 1.3 }}>{question}</div>
            
            {/* SRS box indicator */}
            <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
              {[0,1,2,3,4,5,6].map(b => (
                <div key={b} style={{ width: 8, height: 8, borderRadius: "50%", background: b <= currentCard.box ? "#6366F1" : "#334155", transition: "background 0.2s" }} />
              ))}
            </div>
          </div>

          {/* Input */}
          {!showAnswer ? (
            <div>
              <input
                ref={inputRef}
                autoFocus
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode === "id-to-en" ? "Type the English word..." : "Ketik kata Indonesianya..."}
                style={{ width: "100%", boxSizing: "border-box", background: "#0F172A", border: "2px solid #334155", borderRadius: 14, padding: "16px 20px", fontSize: 18, color: "#F8FAFC", outline: "none", fontFamily: "'DM Mono', monospace", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#6366F1"}
                onBlur={e => e.target.style.borderColor = "#334155"}
              />
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button onClick={checkAnswer} style={{ flex: 1, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#FFF", border: "none", borderRadius: 14, padding: "14px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Check (Enter)
                </button>
                <button onClick={() => { setShowAnswer(true); setFeedback({ isCorrect: false, correctAnswer: answer }); setRetypeInput(""); setRetypeConfirmed(false); setSessionStats(prev => ({ ...prev, wrong: prev.wrong + 1, total: prev.total + 1 })); setVocab(prev => prev.map(v => v.uid !== currentCard.uid ? v : { ...v, box: Math.max(v.box - 1, 0), nextReview: Date.now(), totalAttempts: v.totalAttempts + 1 })); }} style={{ background: "#334155", color: "#94A3B8", border: "none", borderRadius: 14, padding: "14px 20px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  Show
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Feedback - Correct */}
              {feedback?.isCorrect && (
                <>
                  <div style={{ background: "#052E16", border: "1px solid #166534", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#4ADE80", marginBottom: 4 }}>
                      ✓ Correct!
                    </div>
                  </div>

                  {/* Example sentence */}
                  <div style={{ background: "#1E293B", borderRadius: 14, padding: "16px 20px", marginBottom: 20, borderLeft: `3px solid ${catColor.accent}` }}>
                    <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Example</div>
                    <div style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.5, fontStyle: "italic" }}>"{currentCard.ex}"</div>
                  </div>

                  <button onClick={nextCard} autoFocus style={{ width: "100%", background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#FFF", border: "none", borderRadius: 14, padding: "14px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {queueIndex + 1 >= reviewQueue.length ? "Finish" : "Next (Enter)"}
                  </button>
                </>
              )}

              {/* Feedback - Wrong: must retype */}
              {!feedback?.isCorrect && !retypeConfirmed && (
                <>
                  <div style={{ background: "#450A0A", border: "1px solid #991B1B", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#FCA5A5", marginBottom: 8 }}>
                      ✗ Salah
                    </div>
                    {userInput && (
                      <div style={{ color: "#94A3B8", fontSize: 13, marginBottom: 10 }}>
                        Jawabanmu: <span style={{ textDecoration: "line-through", color: "#FCA5A5" }}>{userInput}</span>
                      </div>
                    )}
                    <div style={{ color: "#E2E8F0", fontSize: 16, marginBottom: 4 }}>
                      Jawaban yang benar:
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#FDE68A", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>
                      {feedback?.correctAnswer}
                    </div>
                  </div>

                  {/* Example sentence */}
                  <div style={{ background: "#1E293B", borderRadius: 14, padding: "16px 20px", marginBottom: 16, borderLeft: `3px solid ${catColor.accent}` }}>
                    <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Example</div>
                    <div style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.5, fontStyle: "italic" }}>"{currentCard.ex}"</div>
                  </div>

                  {/* Retype prompt */}
                  <div style={{ background: "#1E293B", borderRadius: 16, padding: "20px", border: "1px solid #F59E0B44", marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#FCD34D", marginBottom: 12 }}>
                      ✏️ Ketik ulang jawaban yang benar untuk melanjutkan:
                    </div>
                    <input
                      ref={retypeRef}
                      autoFocus
                      value={retypeInput}
                      onChange={e => setRetypeInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Ketik: ${feedback?.correctAnswer}`}
                      style={{ width: "100%", boxSizing: "border-box", background: "#0F172A", border: "2px solid #334155", borderRadius: 12, padding: "14px 18px", fontSize: 18, color: "#FDE68A", outline: "none", fontFamily: "'DM Mono', monospace", transition: "border-color 0.3s" }}
                      onFocus={e => e.target.style.borderColor = "#F59E0B"}
                      onBlur={e => e.target.style.borderColor = "#334155"}
                    />
                    <button onClick={checkRetype} style={{ width: "100%", marginTop: 12, background: "linear-gradient(135deg, #D97706, #F59E0B)", color: "#FFF", border: "none", borderRadius: 12, padding: "12px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      Confirm (Enter)
                    </button>
                  </div>
                </>
              )}

              {/* Feedback - Wrong but retyped correctly */}
              {!feedback?.isCorrect && retypeConfirmed && (
                <>
                  <div style={{ background: "#052E16", border: "1px solid #166534", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#4ADE80", marginBottom: 4 }}>
                      ✓ Bagus! Kamu sudah mengetik dengan benar
                    </div>
                    <div style={{ color: "#6EE7B7", fontSize: 14, marginTop: 4 }}>
                      <strong style={{ fontFamily: "'DM Mono', monospace", color: "#FDE68A" }}>{feedback?.correctAnswer}</strong> — ingat baik-baik!
                    </div>
                  </div>

                  {/* Example sentence */}
                  <div style={{ background: "#1E293B", borderRadius: 14, padding: "16px 20px", marginBottom: 20, borderLeft: `3px solid ${catColor.accent}` }}>
                    <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Example</div>
                    <div style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.5, fontStyle: "italic" }}>"{currentCard.ex}"</div>
                  </div>

                  <button onClick={nextCard} autoFocus style={{ width: "100%", background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#FFF", border: "none", borderRadius: 14, padding: "14px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {queueIndex + 1 >= reviewQueue.length ? "Finish" : "Next (Enter)"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Browse Screen
  if (view === "browse") {
    const browseCat = selectedCat;
    const cards = browseCat ? getCategoryCards(browseCat) : vocab;
    const sorted = [...cards].sort((a, b) => a.en.localeCompare(b.en));

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#F8FAFC", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <button onClick={() => { setView("home"); setSelectedCat(null); }} style={{ background: "#334155", border: "none", color: "#94A3B8", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
              ← Back
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{browseCat || "All Words"} ({sorted.length})</h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            <button onClick={() => setSelectedCat(null)} style={{ background: !browseCat ? "#6366F1" : "#334155", border: "none", color: !browseCat ? "#FFF" : "#94A3B8", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>All</button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCat(cat)} style={{ background: browseCat === cat ? (CATEGORY_COLORS[cat]?.accent || "#6366F1") : "#334155", border: "none", color: browseCat === cat ? "#FFF" : "#94A3B8", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", whiteSpace: "nowrap" }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sorted.map(card => {
              const catColor = CATEGORY_COLORS[card.cat] || CATEGORY_COLORS["Abstract"];
              const mastery = card.box >= 4 ? "mastered" : card.box > 0 ? "learning" : "new";
              return (
                <div key={card.uid} style={{ background: "#1E293B", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderLeft: `3px solid ${mastery === "mastered" ? "#10B981" : mastery === "learning" ? "#F59E0B" : "#475569"}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 15, fontFamily: "'DM Mono', monospace" }}>{card.en}</span>
                      <span style={{ fontSize: 11, color: catColor.accent, background: catColor.bg + "22", padding: "2px 8px", borderRadius: 4 }}>{card.cat}</span>
                    </div>
                    <div style={{ color: "#94A3B8", fontSize: 13, marginTop: 2 }}>{card.ind}</div>
                  </div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[0,1,2,3,4,5,6].map(b => (
                      <div key={b} style={{ width: 6, height: 6, borderRadius: "50%", background: b <= card.box ? "#6366F1" : "#334155" }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Stats Screen
  if (view === "stats") {
    const catStats = categories.map(cat => {
      const cards = getCategoryCards(cat);
      const mastered = cards.filter(c => c.box >= 4).length;
      const learning = cards.filter(c => c.box > 0 && c.box < 4).length;
      return { cat, total: cards.length, mastered, learning, newCount: cards.length - mastered - learning };
    }).sort((a, b) => (b.mastered / b.total) - (a.mastered / a.total));

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#F8FAFC", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <button onClick={() => setView("home")} style={{ background: "#334155", border: "none", color: "#94A3B8", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>← Back</button>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Statistics</h2>
          </div>

          {/* Overall */}
          <div style={{ background: "#1E293B", borderRadius: 20, padding: "24px", marginBottom: 20, border: "1px solid #334155" }}>
            <div style={{ fontSize: 14, color: "#64748B", marginBottom: 12 }}>Overall Progress</div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#10B981" }}>{totalMastered}</div>
                <div style={{ fontSize: 12, color: "#6EE7B7" }}>Mastered</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#F59E0B" }}>{totalLearning}</div>
                <div style={{ fontSize: 12, color: "#FCD34D" }}>Learning</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#64748B" }}>{totalNew}</div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>New</div>
              </div>
            </div>
            <div style={{ height: 8, background: "#0F172A", borderRadius: 4, marginTop: 16, overflow: "hidden", display: "flex" }}>
              <div style={{ width: `${(totalMastered / vocab.length) * 100}%`, background: "#10B981", transition: "width 0.5s" }} />
              <div style={{ width: `${(totalLearning / vocab.length) * 100}%`, background: "#F59E0B", transition: "width 0.5s" }} />
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 8, textAlign: "right" }}>
              {Math.round((totalMastered / vocab.length) * 100)}% mastered
            </div>
          </div>

          {/* Per category */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {catStats.map(({ cat, total, mastered, learning, newCount }) => {
              const catColor = CATEGORY_COLORS[cat] || CATEGORY_COLORS["Abstract"];
              return (
                <div key={cat} style={{ background: "#1E293B", borderRadius: 14, padding: "14px 18px", border: "1px solid #334155" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: catColor.accent }}>{cat}</span>
                    <span style={{ fontSize: 12, color: "#64748B" }}>{mastered}/{total}</span>
                  </div>
                  <div style={{ height: 6, background: "#0F172A", borderRadius: 3, overflow: "hidden", display: "flex" }}>
                    <div style={{ width: `${(mastered / total) * 100}%`, background: "#10B981" }} />
                    <div style={{ width: `${(learning / total) * 100}%`, background: "#F59E0B" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // HOME SCREEN
  // ============================================================
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#F8FAFC", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32, paddingTop: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🧠</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 4px 0", background: "linear-gradient(135deg, #C7D2FE, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            VocabForge
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
            Active Recall + Spaced Repetition
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
          {[
            { label: "Total", value: vocab.length, color: "#8B5CF6" },
            { label: "Due Now", value: dueNow, color: "#F59E0B" },
            { label: "Learning", value: totalLearning, color: "#3B82F6" },
            { label: "Mastered", value: totalMastered, color: "#10B981" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#1E293B", borderRadius: 14, padding: "14px 8px", textAlign: "center", border: "1px solid #334155" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Main Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {/* Review Due */}
          <button onClick={() => startReview(getDueCards())} disabled={dueNow === 0} style={{ background: dueNow > 0 ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "#334155", border: "none", borderRadius: 16, padding: "20px 24px", cursor: dueNow > 0 ? "pointer" : "default", textAlign: "left", fontFamily: "inherit", opacity: dueNow > 0 ? 1 : 0.5 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#FFF" }}>
              📝 Review Due Cards ({dueNow})
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
              Indonesia → English (melatih production/speaking)
            </div>
          </button>

          {/* Quick Mix */}
          <button onClick={() => { const shuffled = [...vocab].sort(() => Math.random() - 0.5).slice(0, 20); startReview(shuffled); }} style={{ background: "linear-gradient(135deg, #059669, #10B981)", border: "none", borderRadius: 16, padding: "20px 24px", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#FFF" }}>
              🎲 Quick Mix (20 random)
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
              Random cards from all categories
            </div>
          </button>

          {/* Review Weak */}
          <button onClick={() => { const weak = [...vocab].filter(v => v.totalAttempts > 0).sort((a, b) => (a.totalCorrect / Math.max(a.totalAttempts, 1)) - (b.totalCorrect / Math.max(b.totalAttempts, 1))).slice(0, 20); if (weak.length > 0) startReview(weak); }} style={{ background: "linear-gradient(135deg, #DC2626, #F43F5E)", border: "none", borderRadius: 16, padding: "20px 24px", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#FFF" }}>
              🎯 Weakest Cards
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
              Practice your lowest accuracy words
            </div>
          </button>
        </div>

        {/* Category Grid */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Learn by Category</h2>
            <button onClick={() => setView("browse")} style={{ background: "none", border: "none", color: "#6366F1", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Browse All →</button>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {categories.map(cat => {
              const cards = getCategoryCards(cat);
              const mastered = cards.filter(c => c.box >= 4).length;
              const catColor = CATEGORY_COLORS[cat] || CATEGORY_COLORS["Abstract"];
              const pct = Math.round((mastered / cards.length) * 100);
              
              return (
                <button key={cat} onClick={() => startCategoryLearn(cat)} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 14, padding: "14px 16px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = catColor.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#334155"}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: catColor.accent, marginBottom: 4 }}>{cat}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>{cards.length} words</div>
                  <div style={{ height: 4, background: "#0F172A", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: catColor.accent, borderRadius: 2 }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom nav */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setView("stats")} style={{ flex: 1, background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: "12px", cursor: "pointer", textAlign: "center", fontFamily: "inherit", color: "#94A3B8", fontSize: 13, fontWeight: 500 }}>
            📊 Statistics
          </button>
          <button onClick={() => setView("browse")} style={{ flex: 1, background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: "12px", cursor: "pointer", textAlign: "center", fontFamily: "inherit", color: "#94A3B8", fontSize: 13, fontWeight: 500 }}>
            📖 Browse All
          </button>
        </div>

        {/* Method info */}
        <div style={{ marginTop: 28, background: "#1E293B", borderRadius: 16, padding: "20px", border: "1px solid #334155" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#C7D2FE", marginBottom: 10 }}>💡 Metode Pembelajaran</div>
          <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.7 }}>
            <strong style={{ color: "#E2E8F0" }}>Active Recall</strong> — Kamu diminta mengingat kata, bukan sekadar memilih. Ini melatih <em>production</em> (writing/speaking), bukan hanya recognition.<br/><br/>
            <strong style={{ color: "#E2E8F0" }}>Spaced Repetition (Leitner)</strong> — Kata yang sudah kamu hafal akan muncul lebih jarang. Kata yang sulit akan terus muncul sampai kamu hafal.<br/><br/>
            <strong style={{ color: "#E2E8F0" }}>Semantic Clustering</strong> — Kata dikelompokkan berdasarkan tema, membantu otak membuat koneksi antar kata yang berkaitan.<br/><br/>
            <strong style={{ color: "#E2E8F0" }}>ID → EN Direction</strong> — Default mode adalah Indonesia→English karena ini melatih kemampuan <em>productive</em> yang kamu butuhkan.
          </div>
        </div>
      </div>
    </div>
  );
}
