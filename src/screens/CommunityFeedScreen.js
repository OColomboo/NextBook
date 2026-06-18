import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/appColors';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { CommunityPostCard } from '../components/community/CommunityPostCard';
import { ReviewCommentsModal } from '../components/community/ReviewCommentsModal';
import { ChatActionsMenu } from '../components/chat/ChatActionsMenu';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import {
  deleteReview,
  getCommentsCount,
  toggleSavedReview,
  toggleLike,
} from '../components/community/ReviewService';
import firebase from '../firebaseConfig';
import { getDatabase, onValue, ref } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export function CommunityFeedScreen({ navigate, openMenu }) {
  const { bottomTabBarHeight } = useResponsiveLayout();
  const [reviews, setReviews] = useState([]);
  const [savedReviewIds, setSavedReviewIds] = useState({});
  const [commentsModalReview, setCommentsModalReview] = useState(null);
  const [menuReview, setMenuReview] = useState(null);

  const db = getDatabase(firebase);
  const auth = getAuth(firebase);
  const user = auth.currentUser;

  useEffect(() => {
    const reviewRef = ref(db, 'reviews');
    const unsubscribe = onValue(reviewRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setReviews([]);
        return;
      }

      const reviewsArray = Object.entries(data)
        .map(([id, item]) => ({
          id,
          ...item,
        }))
        .sort((a, b) => (b.criadoEm || 0) - (a.criadoEm || 0));

      setReviews(reviewsArray);
    });

    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    if (!user?.uid) {
      setSavedReviewIds({});
      return undefined;
    }

    const savedRef = ref(db, `savedReviews/${user.uid}`);
    const unsubscribe = onValue(savedRef, (snapshot) => {
      const savedReviews = snapshot.val() || {};
      const savedIds = Object.keys(savedReviews).reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {});

      setSavedReviewIds(savedIds);
    });

    return () => unsubscribe();
  }, [db, user?.uid]);

  async function handleToggleLike(reviewId) {
    if (!user) {
      alert('Voce precisa estar logado para curtir!');
      return;
    }

    try {
      await toggleLike(reviewId, user.uid);
    } catch (error) {
      alert(error.message || 'Nao foi possivel curtir a avaliacao.');
    }
  }

  async function handleToggleSaveReview(review) {
    try {
      if (!user) {
        alert('Voce precisa estar logado para salvar avaliacoes.');
        return;
      }

      if (!review?.id) {
        alert('Nao foi possivel encontrar a avaliacao.');
        return;
      }

      const isSaved = Boolean(savedReviewIds[review.id]);
      await toggleSavedReview(user.uid, review, isSaved);

      setSavedReviewIds((current) => {
        const next = { ...current };

        if (isSaved) {
          delete next[review.id];
        } else {
          next[review.id] = true;
        }

        return next;
      });
    } catch (error) {
      alert(error.message || 'Nao foi possivel atualizar os salvos.');
    }
  }

  function handleDeleteReview(review) {
    Alert.alert('Excluir avaliacao', 'Deseja remover esta avaliacao da comunidade?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReview(review.id, user.uid);
          } catch (error) {
            alert(error.message || 'Nao foi possivel excluir a avaliacao.');
          }
        },
      },
    ]);
  }

  const menuActions = menuReview
    ? [
        {
          label: 'Editar avaliacao',
          onPress: () => navigate('review', { reviewId: menuReview.id }),
        },
        {
          label: 'Excluir avaliacao',
          destructive: true,
          onPress: () => handleDeleteReview(menuReview),
        },
      ]
    : [];

  return (
    <MainScreenScaffold
      active="community"
      navigate={navigate}
      openMenu={openMenu}
      overlay={
        <>
          <ReviewCommentsModal
            visible={Boolean(commentsModalReview)}
            onClose={() => setCommentsModalReview(null)}
            reviewId={commentsModalReview?.id}
            reviewTitle={commentsModalReview?.bookname}
            currentUser={user}
          />

          <ChatActionsMenu
            visible={Boolean(menuReview)}
            onClose={() => setMenuReview(null)}
            title="Opcoes da avaliacao"
            actions={menuActions}
            bottomOffset={bottomTabBarHeight}
          />
        </>
      }
    >
      <Text style={styles.pageTitle}>Comunidade</Text>
      <Text style={styles.pageSubtitle}>Explore as opinioes literarias dos usuarios do NextBook.</Text>

      <View style={styles.composerCard}>
        <View style={styles.composerContent}>
          <Text style={styles.pageBig}>Compartilhe com a comunidade o que voce esta lendo!</Text>
          <View style={styles.composerFooter}>
            <Text style={styles.pageText}>Escreva o que esta achando</Text>

            <TouchableOpacity style={styles.smallBrownButton} onPress={() => navigate('review')}>
              <Text style={styles.smallBrownButtonText}>Escrever</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {reviews.map((item) => {
        const likesByUser = item.likesByUser || {};
        const liked = !!likesByUser[user?.uid];
        const likesCount = Object.keys(likesByUser).length;
        const commentsCount = getCommentsCount(item);
        const isOwner = user?.uid === item.userId;

        return (
          <CommunityPostCard
            key={item.id}
            avatar={item.userName?.slice(0, 2).toUpperCase() || 'US'}
            name={item.userName}
            meta="AVALIACAO"
            bookname={item.bookname}
            publisher={item.publisher}
            rating={item.rating}
            text={item.text}
            imageSource={item.imageSource}
            likes={String(likesCount)}
            liked={liked}
            onLikePress={() => handleToggleLike(item.id)}
            comments={String(commentsCount)}
            onCommentPress={() => setCommentsModalReview({ id: item.id, bookname: item.bookname })}
            saved={Boolean(savedReviewIds[item.id])}
            onSavePress={() => handleToggleSaveReview(item)}
            isOwner={isOwner}
            onMenuPress={() => setMenuReview(item)}
          />
        );
      })}

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
  pageText: {
    color: colors.ink,
    fontSize: 17,
    marginRight: 10,
  },
  pageBig: {
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
