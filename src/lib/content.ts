import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

export interface ManualPage {
  slug: string;
  category: string;
  title: string;
  description: string;
  order: number;
  updatedAt: string;
  content: string;
  htmlContent?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const categories: Category[] = [
  { id: 'operations', name: '운영 매뉴얼', emoji: '🏪', description: '매장 운영 가이드 및 절차' },
  // products는 별도 /products 페이지에서 관리
  // { id: 'products', name: '상품 매뉴얼', emoji: '📦', description: '상품군별 특이사항 및 취급 기준' },
  { id: 'claims', name: '클레임 매뉴얼', emoji: '🚨', description: '클레임 대응 프로세스 및 FAQ' },
  { id: 'guides', name: '업무 가이드', emoji: '📋', description: '이카운트, 시스템 사용법 등' },
];

export function getPagesByCategory(category: string): ManualPage[] {
  const categoryDir = path.join(contentDirectory, category);
  
  if (!fs.existsSync(categoryDir)) return [];
  
  const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
  
  return files.map(filename => {
    const filePath = path.join(categoryDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    return {
      slug: filename.replace(/\.md$/, ''),
      category,
      title: data.title || filename,
      description: data.description || '',
      order: data.order || 99,
      updatedAt: data.updatedAt || '',
      content,
    };
  }).sort((a, b) => a.order - b.order);
}

export async function getPageContent(category: string, slug: string): Promise<ManualPage | null> {
  const filePath = path.join(contentDirectory, category, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) return null;
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  const processedContent = await remark().use(html).process(content);
  
  return {
    slug,
    category,
    title: data.title || slug,
    description: data.description || '',
    order: data.order || 99,
    updatedAt: data.updatedAt || '',
    content,
    htmlContent: processedContent.toString(),
  };
}

export function getAllPages(): ManualPage[] {
  return categories.flatMap(cat => getPagesByCategory(cat.id));
}
