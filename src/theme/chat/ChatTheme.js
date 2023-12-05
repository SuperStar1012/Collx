import Colors from '../resources/Colors';

export const ChatLightTheme = {
  primary: Colors.gray,
  messageSimple: {
    content: {
      // container: {
      //   backgroundColor: 'transparent',
      //   borderWidth: 0,
      // },
      textContainer: {
        backgroundColor: Colors.chatLightContent,
        // textColor: Colors.dark,
        // borderWidth: 15,
        borderWidth: 0,
      },
      replyContainer: {
        backgroundColor: Colors.white,
        // borderColor: Colors.chatLightContent,
        // borderWidth: 1,
        borderRadius: 15,
      },
    },
    // gallery: {
    //   backgroundColor: Colors.chatLightContent,
    // },
    // attachment: {
    //   backgroundColor: Colors.chatLightContent,
    // },
    // giphy: {
    //   container: {
    //     backgroundColor: Colors.chatLightContent,
    //   },
    // },
  },
  colors: {
    black: Colors.dark,
    white: Colors.white,
    white_snow: Colors.white,
    grey_whisper: Colors.chatLightContent,
    grey_gainsboro: Colors.chatLightContent,
    blue_alice: Colors.chatLightContent,
    border: Colors.chatLightContent,
  },
  dateHeader: {
    container: {
      backgroundColor: Colors.chatDarkContent,
    },
  },
};

export const MyMessageTheme = {
  messageSimple: {
    content: {
      // container: {
      //   backgroundColor: 'transparent',
      //   borderWidth: 0,
      // },
      textContainer: {
        backgroundColor: Colors.lightBlue,
        // textColor: Colors.dark,
        borderRadius: 10,
        borderWidth: 0,
      },
      replyContainer: {
        borderColor: Colors.lightBlue,
        borderWidth: 1,
        borderRadius: 15,
      },
      containerInner: {
        borderWidth: 0,
      }
    },
    // gallery: {
    //   backgroundColor: Colors.lightBlue,
    // },
    // attachment: {
    //   backgroundColor: Colors.lightBlue,
    // },
    // giphy: {
    //   container: {
    //     backgroundColor: Colors.lightBlue,
    //   },
    // },
  },
  colors: {
    black: Colors.softGray,
    white_snow: Colors.lightBlue,
    grey_whisper: Colors.lightBlue,
    grey_gainsboro: Colors.lightBlue,
    blue_alice: Colors.lightBlue,
    border: Colors.darkBlue,
  },
};

export const ChatDarkTheme = {
  primary: Colors.lightGray,
  messageSimple: {
    content: {
      // container: {
      //   backgroundColor: 'transparent',
      //   borderWidth: 0,
      // },
      textContainer: {
        backgroundColor: Colors.chatDarkContent,
        // textColor: Colors.dark,
        // borderRadius: 15,
        borderWidth: 0,
      },
      replyContainer: {
        backgroundColor: Colors.black,
        // borderColor: Colors.chatDarkContent,
        // borderWidth: 1,
        borderRadius: 15,
      },
    },
    // gallery: {
    //   backgroundColor: Colors.chatDarkContent,
    // },
    // attachment: {
    //   backgroundColor: Colors.chatLightContent,
    // },
    // giphy: {
    //   container: {
    //     backgroundColor: Colors.chatLightContent,
    //   },
    // },
  },
  colors: {
    black: Colors.softGray,
    white: Colors.black,
    white_snow: Colors.black,
    grey_whisper: Colors.chatDarkContent,
    grey_gainsboro: Colors.chatDarkContent,
    blue_alice: Colors.chatDarkContent,
    border: Colors.chatDarkContent,
  },
  dateHeader: {
    container: {
      backgroundColor: Colors.chatLightContent,
    },
  },
};
