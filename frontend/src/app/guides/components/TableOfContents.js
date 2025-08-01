'use client'

import { useState, useEffect } from 'react'
import { Paper, Typography, List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material'
import { TableOfContents as TocIcon } from '@mui/icons-material'

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,3})\s+(.+)$/gm
    const extractedHeadings = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      
      extractedHeadings.push({
        id,
        text,
        level
      })
    }

    setHeadings(extractedHeadings)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { 
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0 
      }
    )

    // Observe all headings in the document
    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  if (headings.length === 0) return null

  return (
    <Paper className="p-4 bg-gray-50 border border-gray-200">
      <Box className="flex items-center mb-3">
        <TocIcon className="text-gray-600 mr-2" />
        <Typography variant="h6" className="font-semibold text-gray-800">
          Table of Contents
        </Typography>
      </Box>
      
      <List dense>
        {headings.map(({ id, text, level }) => (
          <ListItem key={id} disablePadding>
            <ListItemButton
              onClick={() => scrollToHeading(id)}
              className={`rounded-md transition-colors ${
                activeId === id 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
              sx={{ 
                pl: level * 2,
                minHeight: 36
              }}
            >
              <ListItemText 
                primary={text}
                primaryTypographyProps={{
                  variant: 'body2',
                  className: level === 1 ? 'font-semibold' : 'font-normal'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}