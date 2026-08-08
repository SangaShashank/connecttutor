// Assigns a consistent color to each subject based on its name,
// so "Mathematics" always looks the same everywhere it appears.
const CHIP_COLORS = [
  { bg: 'bg-navy/10', text: 'text-navy' },
  { bg: 'bg-amber/20', text: 'text-amber-900' },
  { bg: 'bg-sage/15', text: 'text-sage' },
  { bg: 'bg-brick/10', text: 'text-brick' },
]

function getColorForSubject(subject) {
  let hash = 0
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % CHIP_COLORS.length
  return CHIP_COLORS[index]
}

function SubjectChip({ subject }) {
  const { bg, text } = getColorForSubject(subject)
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {subject}
    </span>
  )
}

export default SubjectChip