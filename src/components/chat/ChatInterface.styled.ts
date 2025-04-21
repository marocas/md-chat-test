import { Paper, PaperProps, styled } from '@mui/material'
import { Message } from './ChatInterface.types'

export const Bubble = styled(Paper)<PaperProps & Pick<Message, 'sender'>>(
  ({ theme, sender }) => ({
    padding: theme.spacing(2),
    maxWidth: '70%',
    backgroundColor:
      sender === 'assistant'
        ? theme.palette.background.paper
        : theme.palette.primary.light,
    borderRadius: theme.shape.borderRadius,
    color:
      sender === 'user'
        ? theme.palette.primary.contrastText
        : theme.palette.text.primary,
  })
)
