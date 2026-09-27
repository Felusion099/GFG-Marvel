window.BND = window.BND || {};

BND.CONFIG = {
  trackHeightVh: 2400,

  segments: [
    { id: "intro", weight: 5 },
    { id: "jeanIsolation", weight: 7 },
    { id: "peterIntroduction", weight: 9 },
    { id: "identityConversation", weight: 10 },
    { id: "sharedLoss", weight: 9 },
    { id: "alone", weight: 9 },
    { id: "youHaveMe", weight: 10.5 },
    { id: "hold", weight: 5 },
    { id: "spiderSense", weight: 2 },
    { id: "bullet", weight: 1 },
    { id: "impact", weight: 4 },
    { id: "reaction", weight: 10 },
    { id: "ground", weight: 7.5 },
    { id: "aftermath", weight: 4 },
    { id: "hospital", weight: 4.5 },
    { id: "ending", weight: 2.5 }
  ],

  subLabels: {
    imBoth: { after: "identityConversation", offset: 6.5 },
    protectJean: { after: "bullet", offset: 0.3 },
    blood: { after: "impact", offset: 0.5 },
    stagger: { after: "impact", offset: 2.2 },
    fall: { after: "reaction", offset: 0.5 },
    jeanReaction: { after: "reaction", offset: 2.2 },
    injuryDialogue: { after: "reaction", offset: 4 },
    justGo: { after: "reaction", offset: 9.2 },
    hospitalNews: { after: "aftermath", offset: 1.6 },
    peterWake: { after: "hospital", offset: 2 },
    jeanOkay: { after: "hospital", offset: 4.1 },
    black: { after: "ending", offset: 1.2 }
  },

  dialogue: [
    { id: "DIALOGUE_JEAN_01", speaker: "jean", text: "Are you Peter Parker or are you Spider-Man?", seg: "identityConversation", offset: 2, dur: 3 },
    { id: "DIALOGUE_PETER_01", speaker: "peter", text: "I'm both.", seg: "identityConversation", offset: 6.6, dur: 3 },
    { id: "DIALOGUE_PETER_02", speaker: "peter", text: null, seg: "sharedLoss", offset: 0.5, dur: 1.8 },
    { id: "DIALOGUE_JEAN_02", speaker: "jean", text: null, seg: "sharedLoss", offset: 2.5, dur: 1.8 },
    { id: "DIALOGUE_PETER_03", speaker: "peter", text: null, seg: "sharedLoss", offset: 4.5, dur: 1.9 },
    { id: "DIALOGUE_PETER_04", speaker: "peter", text: "We can't do this alone.", seg: "alone", offset: 2, dur: 2.5 },
    { id: "DIALOGUE_JEAN_03", speaker: "jean", text: "I have no one.", seg: "alone", offset: 5.8, dur: 2.5 },
    { id: "DIALOGUE_PETER_YOU_HAVE_ME", speaker: "peter", text: "You have me.", seg: "youHaveMe", offset: 3.5, dur: 3 },
    { id: "DIALOGUE_PETER_INJURED", speaker: "peter", text: "I'm fine.", seg: "impact", offset: 1.5, dur: 1.2 },
    { id: "DIALOGUE_PETER_OKAY", speaker: "peter", text: "I'm okay.", seg: "impact", offset: 2.8, dur: 1.2 },
    { id: "DIALOGUE_JEAN_REACTION", speaker: "jean", text: null, seg: "reaction", offset: 2.2, dur: 1.8 },
    { id: "DIALOGUE_JEAN_04", speaker: "jean", text: "No.", seg: "reaction", offset: 4.2, dur: 1 },
    { id: "DIALOGUE_PETER_GO", speaker: "peter", text: "You gotta get outta here. They'll be looking for you.", seg: "reaction", offset: 5.3, dur: 2.2 },
    { id: "DIALOGUE_JEAN_STAY", speaker: "jean", text: "Stay with me.", seg: "reaction", offset: 7.5, dur: 1.3 },
    { id: "DIALOGUE_PETER_05", speaker: "peter", text: "You're gonna be okay.", seg: "reaction", offset: 8.9, dur: 1.1 },
    { id: "DIALOGUE_PETER_JUST_GO", speaker: "peter", text: "Just go.", seg: "ground", offset: 0.4, dur: 1.2 },
    { id: "DIALOGUE_PETER_06", speaker: "peter", text: "Look at me.", seg: "ground", offset: 1.8, dur: 1.6 },
    { id: "DIALOGUE_HOSPITAL_NEWS", speaker: "news", text: null, seg: "aftermath", offset: 1.6, dur: 2 },
    { id: "DIALOGUE_PETER_WAKE", speaker: "peter", text: "Where's my mask?", seg: "hospital", offset: 2, dur: 1.1 },
    { id: "DIALOGUE_PETER_JEAN", speaker: "peter", text: "Where's Jean? Is she okay?", seg: "hospital", offset: 3.2, dur: 1 },
    { id: "DIALOGUE_JEAN_OKAY", speaker: "jean", text: null, seg: "hospital", offset: 4.1, dur: 0.9 }
  ],

  assetsDir: "public/assets",

  actors: {
    jean: {
      poses: ["isolated", "facing", "reach", "push", "kneel"],
      files: {
        isolated: "jean/jean-isolated",
        facing: "jean/jean-conversation",
        reach: "jean/jean-reach",
        push: "jean/jean-push",
        kneel: "jean/jean-kneel"
      }
    },
    peter: {
      poses: ["stand", "lunge", "stagger", "kneel", "lying"],
      files: {
        stand: "peter/peter-conversation",
        lunge: "peter/peter-lunge",
        stagger: "peter/peter-stagger",
        kneel: "peter/peter-kneel",
        lying: "peter/peter-ground"
      }
    }
  },

  environment: {
    sky: "environment/sky",
    skylineFar: "environment/skyline-far",
    skylineMid: "environment/skyline-mid",
    bokeh: "environment/bokeh",
    rooftop: "environment/rooftop",
    hospitalRoom: "hospital/hospital-room",
    hospitalPeter: "hospital/hospital-peter"
  },

  particles: {
    desktop: 140,
    mobile: 70,
    fgDesktop: 50,
    fgMobile: 0
  }
};
