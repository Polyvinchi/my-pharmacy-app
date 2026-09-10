import codecs

with codecs.open('e:/a-a-pharmacy/app.js', 'r', 'utf-8') as f:
    text = f.read()

# Remove the toggleMobileSidebar function since sidebar is no longer on mobile
text = text.replace("""function toggleMobileSidebar() {
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('mobileOverlay');
    sidebar.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
}""", """function toggleMobileSidebar() {
    // Sidebar no longer used on mobile - handled by bottom nav
}""")

with codecs.open('e:/a-a-pharmacy/app.js', 'w', 'utf-8') as f:
    f.write(text)

print("Done")
