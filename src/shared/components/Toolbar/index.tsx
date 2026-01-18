import ThemeToggle from '@/shared/ui/ThemeToggle'
import ThemeColorPicker from '@/shared/ui/ThemeColorPicker'
import LanguageToggle from '@/shared/ui/LanguageToggle'

function Toolbar() {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '0.5rem', 
      alignItems: 'center',
      padding: '0.5rem'
    }}>
      <ThemeToggle />
      <ThemeColorPicker />
      <LanguageToggle />
    </div>
  )
}

export default Toolbar
