import React from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
  clearLocalNotification,
  setLocalNotification
} from '../utils/helper';
import {
  Badge,
  Button,
  Card
} from 'react-native-elements';


class Quiz extends React.Component {
  state = {
    showQuestion: true,
    questions: this.shuffleQuestions(),
    currentQuestion: 0,
    correctAnswers: 0
  };

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.navTitle
    }
  };

  backToDeck() {
    const backAction = NavigationActions.back();
    this.resetQuiz();
    this.props.navigation.dispatch(backAction);
    this.resetNotification()
  }

  resetNotification() {
    clearLocalNotification()
      .then(setLocalNotification);
  }

  shuffleQuestions() {
    const questions = this.props.navigation.state.params.questions;
    let i = questions.length-1;

    do {
      const randomIndex = Math.floor(Math.random()*(questions.length-1));
      const swapTarget = questions[randomIndex];
      questions[randomIndex] = questions[i];
      questions[i] = swapTarget;
      i--;
    } while (i >= 0);

    return questions;
  }

  resetQuiz() {
    this.setState(() =>{
      return {
        showQuestion: true,
          questions: this.shuffleQuestions(),
        currentQuestion: 0,
        correctAnswers: 0
      }
    });
    this.resetNotification()
  }

  renderCard() {
    const {
      questions,
      currentQuestion,
      correctAnswers
    } = this.state;

    if (currentQuestion < questions.length) {
      return (
        <Card
          title=  {`Q: ${questions[currentQuestion].question}` }
        >
          <View>
            <Text
              style={styles.questionsRemaining}
            >
              {`Question ${currentQuestion+1} of ${questions.length}`}
            </Text>
          </View>
          <View style={styles.badgeStyle}>
            <Badge
              containerStyle={{ backgroundColor: 'violet'}}
              onPress={() => this.setState({ showQuestion: !this.state.showQuestion })}
            >
              <Text>
                {this.state.showQuestion ? "Show Answer" : questions[currentQuestion].answer}
              </Text>
            </Badge>
          </View>
          
          <Button
            buttonStyle={styles.buttonStyle}
            title="Correct"
            backgroundColor='#377D22'
            onPress={() => {
              this.setState({
                currentQuestion: currentQuestion+1,
                correctAnswers: correctAnswers+1,
                showQuestion: true
              });
            }}
          />
          <Button
            buttonStyle={[styles.buttonStyle, { marginTop: 10 }]}
            title="Incorrect"
            backgroundColor='#C3392A'
            onPress={() => this.setState({ 
              currentQuestion: currentQuestion+1,
              showQuestion: true 
            })}
          />
        </Card>
      );
    }
    return (
      <Card
        title={`You got ${correctAnswers} out of ${questions.length}`}
      >
        <Button
          buttonStyle={styles.buttonStyle}
          title="Start Over"
          backgroundColor='#377D22'
          onPress={() => this.resetQuiz()}
        />
        <Button
          buttonStyle={[styles.buttonStyle, { marginTop: 10 }]}
          title="Back to Deck"
          backgroundColor='#C3392A'
          onPress={() => this.backToDeck()}
        />
      </Card>
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center'
        }}
      >
        {this.renderCard()}
      </View>
    );
  }
}

const styles = {
  buttonStyle: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  questionsRemaining: {
    textAlign: 'center',
    marginBottom: 10
  },
  badgeStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 0
  }
};


export default Quiz;