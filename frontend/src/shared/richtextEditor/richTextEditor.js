import { useCallback, useRef, useState, useEffect } from "react"
import ImageUpload from "../imageUpload/imageUpload"
import { useTheme } from "@emotion/react"
import { 
  alpha, 
  Box, 
  Divider, 
  IconButton, 
  Paper, 
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Chip,
  Stack
} from "@mui/material"
import {
  Image as ImageIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberListIcon,
  FormatQuote as QuoteIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  FormatSize as FontSizeIcon,
  FormatColorText as TextColorIcon,
  FormatColorFill as HighlightIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatClear as ClearFormatIcon,
  TableChart as TableIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  StrikethroughS as StrikethroughIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  ViewHeadline as HeadingIcon,
} from '@mui/icons-material';

const RichTextToolbar = ({ 
  onFormat, 
  onImageInsert, 
  onTableInsert,
  onUndo,
  onRedo,
  onClearFormat,
  onToggleFullscreen,
  isFullscreen,
  disabled,
  editorRef
}) => {
  const theme = useTheme()
  const [headingAnchor, setHeadingAnchor] = useState(null)
  const [fontSizeAnchor, setFontSizeAnchor] = useState(null)
  const [textColorAnchor, setTextColorAnchor] = useState(null)
  const [highlightAnchor, setHighlightAnchor] = useState(null)
  const [activeFormats, setActiveFormats] = useState(new Set())
  
  const updateActiveFormats = useCallback(() => {
    if (!editorRef?.current) return
    
    const formats = new Set()
    
    try {
      if (document.queryCommandState('bold')) formats.add('bold')
      if (document.queryCommandState('italic')) formats.add('italic')
      if (document.queryCommandState('underline')) formats.add('underline')
      if (document.queryCommandState('strikeThrough')) formats.add('strikeThrough')
      if (document.queryCommandState('subscript')) formats.add('subscript')
      if (document.queryCommandState('superscript')) formats.add('superscript')
      if (document.queryCommandState('insertUnorderedList')) formats.add('insertUnorderedList')
      if (document.queryCommandState('insertOrderedList')) formats.add('insertOrderedList')
      if (document.queryCommandState('justifyLeft')) formats.add('justifyLeft')
      if (document.queryCommandState('justifyCenter')) formats.add('justifyCenter')
      if (document.queryCommandState('justifyRight')) formats.add('justifyRight')
      
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        let node = selection.anchorNode
        while (node && node !== editorRef.current) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'BLOCKQUOTE') formats.add('blockquote')
            if (node.tagName === 'PRE') formats.add('pre')
          }
          node = node.parentNode
        }
      }
    } catch (e) {
      console.warn('Error checking command state:', e)
    }
    
    setActiveFormats(formats)
  }, [editorRef])

  useEffect(() => {
    const editor = editorRef?.current
    if (!editor) return

    const handleSelectionChange = () => {
      updateActiveFormats()
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    editor.addEventListener('keyup', handleSelectionChange)
    editor.addEventListener('mouseup', handleSelectionChange)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      editor.removeEventListener('keyup', handleSelectionChange)
      editor.removeEventListener('mouseup', handleSelectionChange)
    }
  }, [updateActiveFormats, editorRef])

  const handleFormat = (command, value = null) => {
    if (!editorRef?.current) return
    
    try {
      if (command === 'blockquote') {
        toggleBlockFormat('BLOCKQUOTE')
      } else if (command === 'pre') {
        toggleBlockFormat('PRE')
      } else {
        document.execCommand(command, false, value)
      }
      
      setTimeout(updateActiveFormats, 10)
      onFormat && onFormat()
    } catch (e) {
      console.warn('Error executing command:', command, e)
    }
  }

  const toggleBlockFormat = (tagName) => {
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    let blockElement = range.commonAncestorContainer

    while (blockElement && blockElement !== editorRef.current) {
      if (blockElement.nodeType === Node.ELEMENT_NODE && 
          (blockElement.tagName === 'BLOCKQUOTE' || blockElement.tagName === 'PRE' || 
           blockElement.tagName === 'P' || blockElement.tagName === 'DIV')) {
        break
      }
      blockElement = blockElement.parentNode
    }

    if (blockElement && blockElement.tagName === tagName) {
      const p = document.createElement('p')
      p.innerHTML = blockElement.innerHTML
      blockElement.parentNode.replaceChild(p, blockElement)
    } else {
      const newElement = document.createElement(tagName.toLowerCase())
      if (blockElement && blockElement !== editorRef.current) {
        newElement.innerHTML = blockElement.innerHTML
        blockElement.parentNode.replaceChild(newElement, blockElement)
      } else {
        const contents = range.extractContents()
        newElement.appendChild(contents)
        range.insertNode(newElement)
      }
    }
  }

  const handleHeadingSelect = (tag) => {
    if (tag === 'div') {
      handleFormat('formatBlock', 'p')
    } else {
      handleFormat('formatBlock', tag)
    }
    setHeadingAnchor(null)
  }

  const handleFontSizeSelect = (size) => {
    handleFormat('fontSize', size)
    setFontSizeAnchor(null)
  }

  const handleColorSelect = (color, isHighlight = false) => {
    if (isHighlight) {
      try {
        if (!document.execCommand('hiliteColor', false, color)) {
          document.execCommand('backColor', false, color)
        }
      } catch (e) {
        wrapSelectionInSpan('backgroundColor', color)
      }
      setHighlightAnchor(null)
    } else {
      try {
        if (!document.execCommand('foreColor', false, color)) {
          wrapSelectionInSpan('color', color)
        }
      } catch (e) {
        wrapSelectionInSpan('color', color)
      }
      setTextColorAnchor(null)
    }
    onFormat && onFormat()
  }

  const wrapSelectionInSpan = (styleProperty, value) => {
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (range.collapsed) return

    const span = document.createElement('span')
    span.style[styleProperty] = value
    
    try {
      range.surroundContents(span)
    } catch (e) {
      const contents = range.extractContents()
      span.appendChild(contents)
      range.insertNode(span)
    }
  }

  const toolbarButtons = [
    { icon: BoldIcon, command: 'bold', tooltip: 'Bold (Ctrl+B)' },
    { icon: ItalicIcon, command: 'italic', tooltip: 'Italic (Ctrl+I)' },
    { icon: UnderlineIcon, command: 'underline', tooltip: 'Underline (Ctrl+U)' },
    { icon: StrikethroughIcon, command: 'strikeThrough', tooltip: 'Strikethrough' },
    { icon: SubscriptIcon, command: 'subscript', tooltip: 'Subscript' },
    { icon: SuperscriptIcon, command: 'superscript', tooltip: 'Superscript' },
  ]

  const alignmentButtons = [
    { icon: AlignLeftIcon, command: 'justifyLeft', tooltip: 'Align Left' },
    { icon: AlignCenterIcon, command: 'justifyCenter', tooltip: 'Align Center' },
    { icon: AlignRightIcon, command: 'justifyRight', tooltip: 'Align Right' },
  ]

  const listButtons = [
    { icon: BulletListIcon, command: 'insertUnorderedList', tooltip: 'Bullet List' },
    { icon: NumberListIcon, command: 'insertOrderedList', tooltip: 'Numbered List' },
  ]

  const headingOptions = [
    { label: 'Normal', value: 'div' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
    { label: 'Heading 4', value: 'h4' },
    { label: 'Heading 5', value: 'h5' },
    { label: 'Heading 6', value: 'h6' },
  ]

  const fontSizes = [1, 2, 3, 4, 5, 6, 7]
  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF6600', '#FFCC00', '#00FF00', '#0066FF', '#6600FF',
    '#FF0066', '#8B4513', '#2E8B57', '#4682B4', '#FFB6C1', '#98FB98'
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        p: 1,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        borderRadius: '8px 8px 0 0',
        flexWrap: 'wrap',
      }}
    >
      {/* Undo/Redo */}
      <Tooltip title="Undo (Ctrl+Z)">
        <IconButton size="small" onClick={onUndo} disabled={disabled}>
          <UndoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo (Ctrl+Y)">
        <IconButton size="small" onClick={onRedo} disabled={disabled}>
          <RedoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Headings */}
      <Tooltip title="Headings">
        <IconButton 
          size="small" 
          onClick={(e) => setHeadingAnchor(e.currentTarget)}
          disabled={disabled}
        >
          <HeadingIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Font Size */}
      <Tooltip title="Font Size">
        <IconButton 
          size="small" 
          onClick={(e) => setFontSizeAnchor(e.currentTarget)}
          disabled={disabled}
        >
          <FontSizeIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Text Formatting */}
      {toolbarButtons.map((button, index) => (
        <Tooltip key={index} title={button.tooltip}>
          <IconButton
            size="small"
            onClick={() => handleFormat(button.command, button.value)}
            disabled={disabled}
            sx={{
              color: activeFormats.has(button.command) ? theme.palette.primary.main : theme.palette.text.secondary,
              backgroundColor: activeFormats.has(button.command) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }
            }}
          >
            <button.icon fontSize="small" />
          </IconButton>
        </Tooltip>
      ))}

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Text Color */}
      <Tooltip title="Text Color">
        <IconButton 
          size="small" 
          onClick={(e) => setTextColorAnchor(e.currentTarget)}
          disabled={disabled}
        >
          <TextColorIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Highlight Color */}
      <Tooltip title="Highlight Color">
        <IconButton 
          size="small" 
          onClick={(e) => setHighlightAnchor(e.currentTarget)}
          disabled={disabled}
        >
          <HighlightIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Alignment */}
      {alignmentButtons.map((button, index) => (
        <Tooltip key={index} title={button.tooltip}>
          <IconButton
            size="small"
            onClick={() => handleFormat(button.command)}
            disabled={disabled}
            sx={{
              color: activeFormats.has(button.command) ? theme.palette.primary.main : theme.palette.text.secondary,
              backgroundColor: activeFormats.has(button.command) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }
            }}
          >
            <button.icon fontSize="small" />
          </IconButton>
        </Tooltip>
      ))}

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Lists */}
      {listButtons.map((button, index) => (
        <Tooltip key={index} title={button.tooltip}>
          <IconButton
            size="small"
            onClick={() => handleFormat(button.command)}
            disabled={disabled}
            sx={{
              color: activeFormats.has(button.command) ? theme.palette.primary.main : theme.palette.text.secondary,
              backgroundColor: activeFormats.has(button.command) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }
            }}
          >
            <button.icon fontSize="small" />
          </IconButton>
        </Tooltip>
      ))}

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Quote and Code */}
      <Tooltip title="Quote">
        <IconButton
          size="small"
          onClick={() => handleFormat('blockquote')}
          disabled={disabled}
          sx={{
            color: activeFormats.has('blockquote') ? theme.palette.primary.main : theme.palette.text.secondary,
            backgroundColor: activeFormats.has('blockquote') ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }
          }}
        >
          <QuoteIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Code Block">
        <IconButton
          size="small"
          onClick={() => handleFormat('pre')}
          disabled={disabled}
          sx={{
            color: activeFormats.has('pre') ? theme.palette.primary.main : theme.palette.text.secondary,
            backgroundColor: activeFormats.has('pre') ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }
          }}
        >
          <CodeIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Link */}
      <Tooltip title="Insert Link">
        <IconButton
          size="small"
          onClick={() => {
            const url = prompt('Enter link URL:')
            if (url) handleFormat('createLink', url)
          }}
          disabled={disabled}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }
          }}
        >
          <LinkIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Table */}
      <Tooltip title="Insert Table">
        <IconButton
          size="small"
          onClick={onTableInsert}
          disabled={disabled}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }
          }}
        >
          <TableIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Image */}
      <Tooltip title="Insert Image">
        <IconButton
          size="small"
          onClick={onImageInsert}
          disabled={disabled}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }
          }}
        >
          <ImageIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Clear Formatting */}
      <Tooltip title="Clear Formatting">
        <IconButton size="small" onClick={onClearFormat} disabled={disabled}>
          <ClearFormatIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Fullscreen */}
      <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
        <IconButton size="small" onClick={onToggleFullscreen} disabled={disabled}>
          {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      {/* Heading Menu */}
      <Menu
        anchorEl={headingAnchor}
        open={Boolean(headingAnchor)}
        onClose={() => setHeadingAnchor(null)}
      >
        {headingOptions.map((option) => (
          <MenuItem key={option.value} onClick={() => handleHeadingSelect(option.value)}>
            <Typography variant={option.value === 'div' ? 'body1' : option.value}>
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Font Size Menu */}
      <Menu
        anchorEl={fontSizeAnchor}
        open={Boolean(fontSizeAnchor)}
        onClose={() => setFontSizeAnchor(null)}
      >
        {fontSizes.map((size) => (
          <MenuItem key={size} onClick={() => handleFontSizeSelect(size)}>
            <Typography style={{ fontSize: `${size * 0.2 + 0.6}rem` }}>
              Size {size}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={textColorAnchor}
        open={Boolean(textColorAnchor)}
        onClose={() => setTextColorAnchor(null)}
      >
        <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, maxWidth: 200 }}>
          {colors.map((color) => (
            <Box
              key={color}
              onClick={() => handleColorSelect(color)}
              sx={{
                width: 24,
                height: 24,
                backgroundColor: color,
                cursor: 'pointer',
                border: `2px solid ${color === '#FFFFFF' ? '#ddd' : 'transparent'}`,
                borderRadius: 1,
                '&:hover': {
                  transform: 'scale(1.1)',
                  borderColor: theme.palette.primary.main,
                }
              }}
            />
          ))}
        </Box>
      </Menu>

      <Menu
        anchorEl={highlightAnchor}
        open={Boolean(highlightAnchor)}
        onClose={() => setHighlightAnchor(null)}
      >
        <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, maxWidth: 200 }}>
          {colors.map((color) => (
            <Box
              key={color}
              onClick={() => handleColorSelect(color, true)}
              sx={{
                width: 24,
                height: 24,
                backgroundColor: color,
                cursor: 'pointer',
                border: `2px solid ${color === '#FFFFFF' ? '#ddd' : 'transparent'}`,
                borderRadius: 1,
                '&:hover': {
                  transform: 'scale(1.1)',
                  borderColor: theme.palette.primary.main,
                }
              }}
            />
          ))}
        </Box>
      </Menu>
    </Box>
  )
}

const TableDialog = ({ open, onClose, onInsert }) => {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)

  const handleInsert = () => {
    onInsert(rows, cols)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Insert Table</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Rows"
            type="number"
            value={rows}
            onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1, max: 20 }}
            fullWidth
          />
          <TextField
            label="Columns"
            type="number"
            value={cols}
            onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1, max: 10 }}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleInsert} variant="contained">Insert Table</Button>
      </DialogActions>
    </Dialog>
  )
}

const RichTextEditor = ({ value, onChange, placeholder, disabled }) => {
  const editorRef = useRef(null)
  const theme = useTheme()
  const [imageUploadOpen, setImageUploadOpen] = useState(false)
  const [tableDialogOpen, setTableDialogOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const historyTimeoutRef = useRef(null)

  const saveToHistory = useCallback((content) => {
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current)
    }

    historyTimeoutRef.current = setTimeout(() => {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1)
        
        if (newHistory.length === 0 || newHistory[newHistory.length - 1] !== content) {
          newHistory.push(content)
          if (newHistory.length > 50) {
            newHistory.shift()
            return newHistory
          }
          setHistoryIndex(newHistory.length - 1)
          return newHistory
        }
        return prev
      })
    }, 1000)
  }, [historyIndex])

  const updateStats = useCallback((content) => {
    const text = content.replace(/<[^>]*>/g, '').trim()
    const words = text ? text.split(/\s+/).filter(word => word.length > 0).length : 0
    const chars = text.length
    setWordCount(words)
    setCharCount(chars)
  }, [])

  const handleContentChange = useCallback(() => {
    if (editorRef.current && onChange) {
      const content = editorRef.current.innerHTML
      onChange(content)
      updateStats(content)
      saveToHistory(content)
    }
  }, [onChange, updateStats, saveToHistory])

  const handleImageInsert = (imageData) => {
    if (editorRef.current) {
      const img = document.createElement('img')
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''
      img.src = imageData.url.startsWith('http') ? imageData.url : `${baseUrl}${imageData.url}`
      img.alt = imageData.originalName || 'Uploaded image'
      img.style.maxWidth = '100%'
      img.style.height = 'auto'
      img.style.borderRadius = '8px'
      img.style.margin = '16px 0'
      img.style.display = 'block'
      
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        range.insertNode(img)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        editorRef.current.appendChild(img)
      }
      
      handleContentChange()
    }
  }

  const handleTableInsert = (rows, cols) => {
    if (editorRef.current) {
      let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 16px 0;">'
      
      for (let i = 0; i < rows; i++) {
        tableHTML += '<tr>'
        for (let j = 0; j < cols; j++) {
          tableHTML += `<td style="border: 1px solid #ddd; padding: 8px; min-width: 100px;">${i === 0 ? `Header ${j + 1}` : `Cell ${i},${j + 1}`}</td>`
        }
        tableHTML += '</tr>'
      }
      
      tableHTML += '</table><p><br></p>'
      
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        range.insertNode(document.createRange().createContextualFragment(tableHTML))
        range.collapse(false)
      } else {
        editorRef.current.appendChild(document.createRange().createContextualFragment(tableHTML))
      }
      
      handleContentChange()
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const content = history[newIndex]
      if (editorRef.current && content !== undefined) {
        editorRef.current.innerHTML = content
        onChange && onChange(content)
        updateStats(content)
      }
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const content = history[newIndex]
      if (editorRef.current && content !== undefined) {
        editorRef.current.innerHTML = content
        onChange && onChange(content)
        updateStats(content)
      }
    }
  }

  const handleClearFormat = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      document.execCommand('removeFormat', false, null)
      const range = selection.getRangeAt(0)
      const span = document.createElement('span')
      span.innerHTML = range.toString()
      span.removeAttribute('style')
      if (range.toString()) {
        range.deleteContents()
        range.insertNode(document.createTextNode(span.textContent))
      }
    }
    handleContentChange()
  }

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault()
          if (e.shiftKey) {
            handleRedo()
          } else {
            handleUndo()
          }
          break
        case 'y':
          e.preventDefault()
          handleRedo()
          break
        case 'b':
          e.preventDefault()
          document.execCommand('bold', false, null)
          handleContentChange()
          break
        case 'i':
          e.preventDefault()
          document.execCommand('italic', false, null)
          handleContentChange()
          break
        case 'u':
          e.preventDefault()
          document.execCommand('underline', false, null)
          handleContentChange()
          break
      }
    }
  }, [handleContentChange, handleUndo, handleRedo])

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current
      editor.addEventListener('keydown', handleKeyDown)
      return () => editor.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const currentContent = editorRef.current.innerHTML
      const newContent = value || ''
      
      if (newContent !== currentContent) {
        editorRef.current.innerHTML = newContent || `<p style="color: #999; font-style: italic;">${placeholder || 'Start writing...'}</p>`
        updateStats(newContent)
        
        if (history.length === 0 && newContent) {
          setHistory([newContent])
          setHistoryIndex(0)
        }
      }
    }
  }, [value, placeholder, updateStats, history.length])

  useEffect(() => {
    return () => {
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current)
      }
    }
  }, [])

  const editorStyles = {
    minHeight: isFullscreen ? 'calc(100vh - 200px)' : 400,
    p: 3,
    outline: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    '&:focus': {
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
    '& blockquote': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      paddingLeft: 2,
      margin: '16px 0',
      fontStyle: 'italic',
      color: theme.palette.text.secondary,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      padding: 2,
      borderRadius: 1,
    },
    '& pre': {
      backgroundColor: alpha(theme.palette.grey[500], 0.1),
      padding: 2,
      borderRadius: 1,
      fontFamily: 'monospace',
      overflow: 'auto',
      border: `1px solid ${alpha(theme.palette.grey[500], 0.3)}`,
      whiteSpace: 'pre-wrap',
    },
    '& ul, & ol': {
      paddingLeft: 3,
    },
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      }
    },
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: 1,
      margin: '16px 0',
      boxShadow: theme.shadows[2],
    },
    '& table': {
      borderCollapse: 'collapse',
      width: '100%',
      margin: '16px 0',
      '& td, & th': {
        border: `1px solid ${theme.palette.divider}`,
        padding: 1,
        minWidth: 100,
      },
      '& th': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        fontWeight: 600,
      }
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      margin: '24px 0 16px 0',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    '& p': {
      margin: '8px 0',
      lineHeight: 1.6,
    }
  }

  const containerProps = isFullscreen ? {
    sx: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      backgroundColor: theme.palette.background.default,
      p: 2,
    }
  } : {}

  return (
    <Box {...containerProps}>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <RichTextToolbar 
          onFormat={handleContentChange} 
          onImageInsert={() => setImageUploadOpen(true)}
          onTableInsert={() => setTableDialogOpen(true)}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClearFormat={handleClearFormat}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
          disabled={disabled}
          editorRef={editorRef}
        />
        <Box
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={handleContentChange}
          onBlur={handleContentChange}
          sx={editorStyles}
        />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            py: 1,
            backgroundColor: alpha(theme.palette.grey[500], 0.05),
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            fontSize: '0.75rem',
            color: theme.palette.text.secondary,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption">Words: {wordCount}</Typography>
            <Typography variant="caption">Characters: {charCount}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={`History: ${historyIndex + 1}/${history.length}`} 
              size="small" 
              variant="outlined"
            />
          </Box>
        </Box>
      </Paper>
      
      <ImageUpload
        open={imageUploadOpen}
        onClose={() => setImageUploadOpen(false)}
        onImageSelect={handleImageInsert}
        multiple={false}
      />

      <TableDialog
        open={tableDialogOpen}
        onClose={() => setTableDialogOpen(false)}
        onInsert={handleTableInsert}
      />
    </Box>
  )
}

export default RichTextEditor