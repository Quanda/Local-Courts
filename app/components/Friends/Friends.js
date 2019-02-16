import React from 'react';
import { View, Modal, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { ListItem, SearchBar, Header } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { sendFriendRequest, removeFriend } from '../../actions/User';
import AddFriend from './AddFriend';
import ViewFriend from './ViewFriend';
import { Cancel } from '../navButtons';
import styles from '../styles/main';


class Friends extends React.Component {

    state = {
      friends: [],
      filter: false,
      search: '',
      showAddFriendModal: false,
      showViewFriendModal: false,
      selectedFriend: null
    }
    updateSearch = search => {
      this.setState({search})
      this.filterFriends(search)
    }
    setModalVisible = (visible, type) => {
      switch(type) {
        case 'Add Friend' :
          this.setState({
            showAddFriendModal: visible
          })
          break;
        case 'View Friend' :
          this.setState({
            showViewFriendModal: visible
          })
      }
    }
    filterFriends = (input) => {
      if(this.props.friends) {
        const friends = this.props.friends.filter(f => {
          return f.displayName.includes(input);
        })
        this.setState({
          friends,
          filter: true
        })
      }
    }
    handleViewFriend = (uid) => {
      this.setModalVisible(true, 'View Friend');
      this.setState({
        selectedFriend: uid
      })
    }
    render() {
      if(this.props.currentUser) {

        let friendList;
        if(this.props.friends && this.props.friends.length > 0) {
          let friends = this.state.filter ? this.state.friends : this.props.friends;
          friendList =
                    friends.map((friend) => (
                      <ListItem
                        containerStyle={{width: 300}}
                        onPress={() => this.handleViewFriend(friend.uid)}
                        leftAvatar={{rounded: true, source: {uri: friend.photoURL} }}
                        key={friend.uid}
                        title={friend.displayName}
                        subtitle={friend.email}
                        bottomDivider
                      />
                    ))
        }
        return (
          <View style={styles.centeredContainer}>
            {this.state.showAddFriendModal || this.state.showViewFriendModal ?
              <StatusBar hidden />
              : null
            }
            <Header
              centerComponent={{ text: 'Friends', style: { color: '#FFFFFF', fontSize: 24 } }}
              containerStyle={styles.routeHeader}
              rightComponent={
                <TouchableOpacity
                  onPress={() => this.setModalVisible(true, 'Add Friend')}
                  style={{flexDirection: 'row'}}
                >
                  <IonIcon
                    name='ios-person-add'
                    size={30}
                    color='#fff'
                  />
                </TouchableOpacity>
              }
            />
            {/* FRIENDS */}
            <SearchBar
              lightTheme
              containerStyle={{width: 300,marginBottom: 5,backgroundColor: 'transparent',borderBottomColor: 'transparent',borderTopColor: 'transparent'}}
              inputStyle={{color: '#333'}}
              onChangeText={this.updateSearch}
              placeholder='Filter by Name...'
              value={this.state.search}
            />
            <ScrollView>
              {friendList}
            </ScrollView>
            <Modal
              transparent={false}
              visible={this.state.showAddFriendModal}>
              <View style={styles.modalBackground}>
                <View style={[styles.modalContent]}>
                  <AddFriend onAddFriend={(uid,fid) => {
                    this.setModalVisible(false, 'Add Friend');
                    this.props.dispatch(sendFriendRequest(uid,fid));
                  }}/>
                </View>
              </View>
              <Cancel onCancel={() => this.setModalVisible(false, 'Add Friend')} />
            </Modal>
            {/* VIEW FRIEND */}
            <Modal
              transparent={false}
              visible={this.state.showViewFriendModal}>
              <View style={styles.modalBackground}>
                <View style={[styles.modalContent]}>
                  {/* show users timeline activity
                                    and options to remove friend or send message (rev2)*/}
                  <ViewFriend
                    currentUser={this.props.currentUser}
                    friend={this.state.selectedFriend ? this.props.friends.find(f=>f.uid===this.state.selectedFriend) : null}
                    onRemoveFriend={(uid,fid) => {
                      this.setModalVisible(false, 'View Friend');
                      this.props.dispatch(removeFriend(uid,fid))
                    }}
                  />
                </View>
              </View>
              <Cancel onCancel={() => this.setModalVisible(false, 'View Friend')} />
            </Modal>
          </View>
        )
      } else return null;
    }
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  friends: state.friends,
})
export default connect(mapStateToProps)(Friends);