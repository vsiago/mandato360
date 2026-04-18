import os

count = 0
target_dir = r"c:\Users\iago-note\Documents\mandato360\apps\mandato360\app\[tenant]\dashboard"

for root, dirs, files in os.walk(target_dir):
    for f in files:
        if f.endswith('.tsx'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as file:
                content = file.read()
            if 'p-4 md:p-6 lg:p-8' in content:
                new_content = content.replace('p-4 md:p-6 lg:p-8', 'flex flex-col gap-5')
                with open(p, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                count += 1

print(f'Replaced in {count} files')
