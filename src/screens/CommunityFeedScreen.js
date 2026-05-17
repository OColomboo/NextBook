import React, { useEffect, useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/appColors';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { CommunityPostCard } from '../components/community/CommunityPostCard';
import firebase from '../firebaseConfig';
import { getDatabase, ref, get, onValue} from 'firebase/database';


export function CommunityFeedScreen({ navigate, openMenu }) {
  const [review,setReviews] = useState([]);
  const db = getDatabase(firebase);
  
  useEffect(() => {
    const reviewRef = ref(db, 'reviews');
    const unsubscribe = onValue(reviewRef, (snapshot) => {
      const data = snapshot.val();

      if(!data){
        setReviews([]);
        return;
      }

      const reviewsArray = Object.entries(data)
        .map(([id, review]) => ({
          id,
          ...review,
        }))
        .sort((a, b) => (b.criadoEm || 0) - (a.criadoEm || 0));
      setReviews(reviewsArray);
    });
    return()=> unsubscribe();
  }, []);
  
  return (
    <MainScreenScaffold active="community" navigate={navigate} openMenu={openMenu}>
      <Text style={styles.pageTitle}>Comunidade</Text>
      <Text style={styles.pageSubtitle}>Explore as opiniôes literárias dos usuários do NextBook.</Text>

      <View style={styles.composerCard}>
        <View style={styles.composerContent}>
          <Text style={styles.pageBig}>Compartilhe com a comunidade o que você está lendo!</Text>
          <View style={styles.composerFooter}>
            <Text style={styles.pageText}>Escreva o que está achando</Text>
            <TouchableOpacity style={styles.smallBrownButton} onPress={() => navigate('review')}>
              <Text style={styles.smallBrownButtonText}>
              Escrever
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {review.map((review)=> (
        <CommunityPostCard
          key={review.id}
          avatar={review.userName?.slice(0, 2).toUpperCase() || 'US'}
          name={review.userName}
          meta="AVALIAÇÃO"
          bookname={review.bookname}
          rating={review.rating}
          text={review.text}
          imageSource={review.imageSource}
          likes={String(review.likes || 0)}
          comments={String(review.comments || 0)}
        />
      ))}
    </MainScreenScaffold>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    color: colors.ink,
    fontSize: 33,
    lineHeight: 40,
    marginTop: 28,
  },
  pageText:{
    color: colors.ink,
    fontSize: 17,
    marginRight: 10
  },
  pageBig:{
    color: colors.ink,
    fontSize: 23,
  },
  pageSubtitle: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 25,
    marginTop: 12,
    marginBottom: 34,
  },
  composerCard: {
    flexDirection: 'row',
    backgroundColor: colors.paper,
    borderRadius: 8,
    padding: 14,
    marginBottom: 30,
  },
  composerContent: {
    flex: 1,
  },
  composerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 18,
  },
  smallBrownButton: {
    backgroundColor: colors.brown,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  smallBrownButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
