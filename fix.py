import sys, re

with open('src/components/ActionGrid.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix phone
content = re.sub(
    r"href=\{`tel:\$\{getItemValue\('socials', 'Phone', s\?\.social_links\?\.phone \|\| '01000000000', 'action_value'\)\.replace\('tel:', ''\)\}`\}",
    r"href={`tel:${(s?.social_links?.phone || getItemValue('socials', 'Phone', '01000000000', 'action_value')).replace('tel:', '')}`}",
    content
)

# Fix Whatsapp
content = re.sub(
    r"href=\{`https://wa\.me/\$\{getItemValue\('socials', 'WhatsappNative', s\?\.whatsapp_number \|\| '201000000000', 'action_value'\)\}`\}",
    r"href={`https://wa.me/${(s?.social_links?.whatsapp || getItemValue('socials', 'WhatsappNative', '201000000000', 'action_value'))}`}",
    content
)

# Fix landline
content = re.sub(
    r"href=\{`tel:\$\{getItemValue\('socials', 'Phone', s\?\.social_links\?\.landline \|\| '0220000000', 'action_value', 2\)\.replace\('tel:', ''\)\}`\}",
    r"href={`tel:${(s?.social_links?.landline || getItemValue('socials', 'Phone', '0220000000', 'action_value', 2)).replace('tel:', '')}`}",
    content
)

# Fix Facebook
content = re.sub(
    r"href=\{getItemValue\('socials', 'FacebookNative', s\?\.social_links\?\.facebook \|\| 'https://facebook\.com', 'action_value'\)\}",
    r"href={s?.social_links?.facebook || getItemValue('socials', 'FacebookNative', 'https://facebook.com', 'action_value')}",
    content
)

# Fix Instagram
content = re.sub(
    r"href=\{getItemValue\('socials', 'InstagramNative', s\?\.social_links\?\.instagram \|\| 'https://instagram\.com', 'action_value'\)\}",
    r"href={s?.social_links?.instagram || getItemValue('socials', 'InstagramNative', 'https://instagram.com', 'action_value')}",
    content
)

# Fix Talabat
content = re.sub(
    r'href=\{svc\.action_value \|\| "https://www\.talabat\.com"\}',
    r'href={s?.social_links?.talabat || svc.action_value || "https://www.talabat.com"}',
    content
)

with open('src/components/ActionGrid.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
