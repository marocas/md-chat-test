import { Box, Link, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }: any) => (
          <Typography variant="h5" gutterBottom {...props} />
        ),
        h2: ({ node, ...props }: any) => (
          <Typography variant="h6" gutterBottom {...props} />
        ),
        h3: ({ node, ...props }: any) => (
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
            {...props}
          />
        ),
        p: ({ node, ...props }: any) => (
          <Typography variant="body1" paragraph {...props} />
        ),
        a: ({ node, ...props }: any) => <Link color="primary" {...props} />,
        ul: ({ node, ...props }: any) => (
          <Box component="ul" sx={{ pl: 2, my: 1 }} {...props} />
        ),
        ol: ({ node, ...props }: any) => (
          <Box component="ol" sx={{ pl: 2, my: 1 }} {...props} />
        ),
        li: ({ node, ...props }: any) => (
          <Box component="li" sx={{ my: 0.5 }} {...props} />
        ),
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <Typography
              component="code"
              sx={{
                bgcolor: 'grey.100',
                px: 0.5,
                borderRadius: 0.5,
              }}
              {...props}
            />
          ) : (
            <Box
              component="pre"
              sx={{
                bgcolor: 'grey.100',
                p: 1.5,
                borderRadius: 1,
                overflowX: 'auto',
                my: 1.5,
              }}
              {...props}
            />
          ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
