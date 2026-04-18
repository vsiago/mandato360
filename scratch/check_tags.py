
import re

def count_tags(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove strings and comments to avoid false positives
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    content = re.sub(r'//.*', '', content)
    # This is a bit naive for JSX but can help
    
    div_opens = len(re.findall(r'<div', content))
    div_closes = len(re.findall(r'</div', content))
    
    sec_opens = len(re.findall(r'<section', content))
    sec_closes = len(re.findall(r'</section', content))
    
    span_opens = len(re.findall(r'<span', content))
    span_closes = len(re.findall(r'</span', content))
    
    button_opens = len(re.findall(r'<Button', content))
    button_closes = len(re.findall(r'</Button', content))
    
    header_opens = len(re.findall(r'<header', content))
    header_closes = len(re.findall(r'</header', content))
    
    footer_opens = len(re.findall(r'<footer', content))
    footer_closes = len(re.findall(r'</footer', content))

    print(f"Div: {div_opens} / {div_closes}")
    print(f"Section: {sec_opens} / {sec_closes}")
    print(f"Span: {span_opens} / {span_closes}")
    print(f"Button: {button_opens} / {button_closes}")
    print(f"Header: {header_opens} / {header_closes}")
    print(f"Footer: {footer_opens} / {footer_closes}")

if __name__ == "__main__":
    count_tags('apps/mandato360/app/[tenant]/landing-content.tsx')
