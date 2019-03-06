import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#379eb6',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Quicksand-Light',
  },
  button: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginTop: 25,
    paddingVertical: 12
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#7fb0c8',
    textAlign: 'center',
    fontFamily: 'Quicksand-Medium',
  },
  buttonTextDash: {
    fontSize: 18,
    fontWeight: '300',
    color: '#7fb0c8',
    textAlign: 'center',
  },
  inputBar: {
    flexDirection: 'row',
    width: '98%',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  signupTextCont: {
    alignItems: 'center',
    marginTop: 10,

  },
  forgotText: {
    color: '#ffffff',
    fontSize: 20,
    marginVertical: 10,
    fontFamily: 'Quicksand-Light',
  },
   headerText: {
    marginTop: 0,
    marginBottom: 10,
    fontFamily: 'Quicksand-Bold',
    fontSize: 25,
    color: '#fff',
  },
   forgotText: {
    marginTop: 0,
    marginBottom: 10,
    fontSize: 18,
    color: '#fff',
  },
  headerCont:{
    width: '90%',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:'5%',
  }
});
