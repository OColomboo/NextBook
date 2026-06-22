import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../../firebaseConfig';
import { getDatabase, onValue, ref } from 'firebase/database';
import { colors } from '../../theme/appColors';
import { cardShadow } from '../../theme/cardShadow';
import { addComment, deleteComment, updateComment } from './ReviewService';
import { useResponsiveLayout } from '../../theme/ResponsiveLayoutContext';
import { snapshotToArray, sortByOldest } from '../../utils/firebaseSnapshots';

function formatCommentDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ReviewCommentsModal({ visible, onClose, reviewId, reviewTitle, currentUser }) {
  const { bottomTabBarHeight } = useResponsiveLayout();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible || !reviewId) {
      setComments([]);
      return undefined;
    }

    const db = getDatabase(firebase);
    const commentsRef = ref(db, `reviews/${reviewId}/comments`);

    const unsubscribe = onValue(commentsRef, (snapshot) => {
      setComments(snapshotToArray(snapshot).sort(sortByOldest('criadoEm')));
    });

    return () => unsubscribe();
  }, [visible, reviewId]);

  useEffect(() => {
    if (!visible) {
      setCommentText('');
      setEditingCommentId(null);
      setEditingText('');
    }
  }, [visible]);

  async function handleAddComment() {
    if (!currentUser) {
      alert('Voce precisa estar logado para comentar.');
      return;
    }

    const text = commentText.trim();

    if (!text) {
      return;
    }

    setSubmitting(true);

    try {
      await addComment(reviewId, currentUser, text);
      setCommentText('');
    } catch (error) {
      alert(error.message || 'Nao foi possivel enviar o comentario.');
    } finally {
      setSubmitting(false);
    }
  }

  function startEditing(comment) {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  }

  async function handleSaveEdit() {
    const text = editingText.trim();

    if (!text || !editingCommentId) {
      return;
    }

    setSubmitting(true);

    try {
      await updateComment(reviewId, editingCommentId, currentUser.uid, text);
      setEditingCommentId(null);
      setEditingText('');
    } catch (error) {
      alert(error.message || 'Nao foi possivel editar o comentario.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleDeleteComment(commentId) {
    Alert.alert('Excluir comentario', 'Deseja remover este comentario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteComment(reviewId, commentId, currentUser.uid);
          } catch (error) {
            alert(error.message || 'Nao foi possivel excluir o comentario.');
          }
        },
      },
    ]);
  }

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.panel, { paddingBottom: bottomTabBarHeight }]}>
          <View style={styles.header}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.title}>Comentarios</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {reviewTitle || 'Avaliacao'}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={22} color={colors.brownDark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.commentsList} contentContainerStyle={styles.commentsContent}>
            {comments.length === 0 ? (
              <Text style={styles.emptyText}>Seja o primeiro a comentar.</Text>
            ) : (
              comments.map((comment) => {
                const isOwner = currentUser?.uid === comment.userId;
                const isEditing = editingCommentId === comment.id;

                return (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.userName || 'Usuario'}</Text>
                      <Text style={styles.commentDate}>{formatCommentDate(comment.criadoEm)}</Text>
                    </View>

                    {isEditing ? (
                      <>
                        <TextInput
                          style={styles.editInput}
                          value={editingText}
                          onChangeText={setEditingText}
                          multiline
                        />
                        <View style={styles.commentActions}>
                          <TouchableOpacity onPress={() => setEditingCommentId(null)}>
                            <Text style={styles.cancelAction}>Cancelar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handleSaveEdit} disabled={submitting}>
                            <Text style={styles.saveAction}>Salvar</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text style={styles.commentText}>{comment.text}</Text>
                        {isOwner ? (
                          <View style={styles.commentActions}>
                            <TouchableOpacity onPress={() => startEditing(comment)}>
                              <Text style={styles.editAction}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                              <Text style={styles.deleteAction}>Excluir</Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}
                      </>
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Escreva um comentario..."
              placeholderTextColor={colors.softText}
              value={commentText}
              onChangeText={setCommentText}
              editable={!submitting}
            />
            <TouchableOpacity
              style={[styles.sendButton, submitting && styles.sendButtonDisabled]}
              onPress={handleAddComment}
              disabled={submitting}
            >
              <Feather name="send" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  keyboardWrap: {
    maxHeight: '78%',
  },
  panel: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 320,
    maxHeight: '100%',
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.brownDark,
    fontSize: 18,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsList: {
    flexGrow: 0,
    maxHeight: 360,
  },
  commentsContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 24,
  },
  commentItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: 14,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
  },
  commentAuthor: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  commentDate: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  commentText: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
  editInput: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.ink,
    fontSize: 15,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  editAction: {
    color: colors.brown,
    fontSize: 13,
    fontWeight: '800',
  },
  deleteAction: {
    color: '#a33b2b',
    fontSize: 13,
    fontWeight: '800',
  },
  cancelAction: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  saveAction: {
    color: colors.brown,
    fontSize: 13,
    fontWeight: '800',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  input: {
    flex: 1,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceWarm,
    paddingHorizontal: 16,
    color: colors.ink,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});
