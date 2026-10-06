import re

with open('src/app/admin/OffersManager.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix openAddModal missing bracket
code = code.replace('<button onClick={openAddModal}', '{canEdit && <button onClick={openAddModal}')
# Fix edit missing bracket
code = code.replace('<button onClick={() => handleEditClick(offer)}', '{canEdit && <button onClick={() => handleEditClick(offer)}')

with open('src/app/admin/OffersManager.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print('Fixed OffersManager')

with open('src/app/admin/sections/SectionsManager.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix adding section missing bracket
if '{canEdit && <button\n            onClick={() => setIsSectionModalOpen(true)}' not in code:
    code = code.replace('<button\n            onClick={() => setIsSectionModalOpen(true)}', '{canEdit && <button\n            onClick={() => setIsSectionModalOpen(true)}')

# Check for unmatched closing brackets due to previous replacement
# Let's just run build and see if SectionsManager fails too. 
# My previous regex replaced `<button onClick={() => setEditingSection(section)}` properly.

with open('src/app/admin/sections/SectionsManager.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print('Fixed SectionsManager')
