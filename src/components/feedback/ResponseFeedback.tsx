import {
  FeedbackCategory,
  FeedbackData,
  FeedbackRating,
  submitFeedback,
} from '@/services/feedbackService'
import { ChatMessage } from '@/services/ollamaService'
import CloseIcon from '@mui/icons-material/Close'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

interface ResponseFeedbackProps {
  messageId: string
  queryText: string
  responseText: string
  modelInfo: string
  userId: string
  conversationContext?: ChatMessage[]
}

export default function ResponseFeedback({
  messageId,
  queryText,
  responseText,
  modelInfo,
  userId,
  conversationContext,
}: ResponseFeedbackProps) {
  const [rating, setRating] = useState<FeedbackRating | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<
    FeedbackCategory[]
  >([])
  const { enqueueSnackbar } = useSnackbar()

  const feedbackCategories: FeedbackCategory[] = [
    'accuracy',
    'clarity',
    'completeness',
    'safety',
    'helpfulness',
    'other',
  ]

  const handleRatingClick = (selectedRating: FeedbackRating) => {
    setRating(selectedRating)

    // For positive ratings, we can submit immediately without the detailed dialog
    if (selectedRating === 'positive') {
      handleSubmitQuickFeedback(selectedRating)
    } else {
      // For neutral or negative, open the dialog for more details
      setIsDialogOpen(true)
    }
  }

  const handleSubmitQuickFeedback = async (quickRating: FeedbackRating) => {
    const feedbackData: FeedbackData = {
      id: `feedback-${Date.now()}`,
      userId,
      messageId,
      rating: quickRating,
      queryText,
      responseText,
      modelInfo,
      timestamp: new Date(),
      conversationContext,
    }

    try {
      await submitFeedback(feedbackData)
      enqueueSnackbar('Thank you for your feedback!', { variant: 'success' })
    } catch (error) {
      console.error('Error submitting feedback:', error)
      enqueueSnackbar('Failed to submit feedback', { variant: 'error' })
    }
  }

  const handleDetailedFeedbackSubmit = async () => {
    const feedbackData: FeedbackData = {
      id: `feedback-${Date.now()}`,
      userId,
      messageId,
      rating: rating || 'neutral',
      categories:
        selectedCategories.length > 0 ? selectedCategories : undefined,
      comment: comment.trim() || undefined,
      queryText,
      responseText,
      modelInfo,
      timestamp: new Date(),
      conversationContext,
    }

    try {
      await submitFeedback(feedbackData)
      enqueueSnackbar('Thank you for your detailed feedback!', {
        variant: 'success',
      })
      handleCloseDialog()
    } catch (error) {
      console.error('Error submitting feedback:', error)
      enqueueSnackbar('Failed to submit feedback', { variant: 'error' })
    }
  }

  const handleCategoryToggle = (category: FeedbackCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setComment('')
    setSelectedCategories([])
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mt: 1,
        justifyContent: 'flex-end',
      }}
    >
      <Typography variant="caption" sx={{ mr: 1, opacity: 0.7 }}>
        Was this response helpful?
      </Typography>

      <Tooltip title="This was helpful">
        <IconButton
          size="small"
          onClick={() => handleRatingClick('positive')}
          color={rating === 'positive' ? 'success' : 'default'}
        >
          <ThumbUpIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="This wasn't helpful">
        <IconButton
          size="small"
          onClick={() => handleRatingClick('negative')}
          color={rating === 'negative' ? 'error' : 'default'}
        >
          <ThumbDownIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Add detailed feedback">
        <IconButton size="small" onClick={() => setIsDialogOpen(true)}>
          <RateReviewIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Detailed Feedback Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Response Feedback
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            How would you rate this response?
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button
              variant={rating === 'positive' ? 'contained' : 'outlined'}
              color="success"
              startIcon={<ThumbUpIcon />}
              onClick={() => setRating('positive')}
            >
              Helpful
            </Button>
            <Button
              variant={rating === 'neutral' ? 'contained' : 'outlined'}
              color="info"
              onClick={() => setRating('neutral')}
            >
              Neutral
            </Button>
            <Button
              variant={rating === 'negative' ? 'contained' : 'outlined'}
              color="error"
              startIcon={<ThumbDownIcon />}
              onClick={() => setRating('negative')}
            >
              Not Helpful
            </Button>
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            What aspects need improvement? (Optional)
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {feedbackCategories.map(category => (
              <Chip
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                onClick={() => handleCategoryToggle(category)}
                color={
                  selectedCategories.includes(category) ? 'primary' : 'default'
                }
                variant={
                  selectedCategories.includes(category) ? 'filled' : 'outlined'
                }
              />
            ))}
          </Box>

          <TextField
            label="Additional comments (optional)"
            multiline
            fullWidth
            rows={4}
            value={comment}
            onChange={e => setComment(e.target.value)}
            variant="outlined"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleDetailedFeedbackSubmit}
            variant="contained"
            color="primary"
            disabled={!rating}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
