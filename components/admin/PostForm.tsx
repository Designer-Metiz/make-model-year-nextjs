"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Upload,
  Calendar,
  Clock,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Link,
  Code,
  Type,
  Palette,
  Highlighter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { BlogService } from '@/services/blogService';
import { BlogPost } from '@/lib/supabase';
import { AuthorService, type Author } from '@/services/authorService';
import { StorageService } from '@/services/storageService';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  status: z.enum(['draft', 'published']),
  publishedDate: z.string().optional(),
  readTime: z.string().optional(),
  seoTitle: z.string().max(70, 'SEO title must be 70 characters or less').optional(),
  seoDescription: z.string().max(160, 'SEO description must be 160 characters or less').optional(),
  seoSchema: z.string().optional(),
  blogImage: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

const PostForm: React.FC<{ postId?: string }> = ({ postId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [seoTitleCount, setSeoTitleCount] = useState(0);
  const [seoDescriptionCount, setSeoDescriptionCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const isEditing = Boolean(postId);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      status: 'draft',
      publishedDate: new Date().toISOString().slice(0, 16),
      readTime: '',
      seoTitle: '',
      seoDescription: '',
      seoSchema: '',
      blogImage: '',
    },
  });

  // Load post data for editing
  useEffect(() => {
    const loadPost = async () => {
      if (isEditing && postId) {
        try {
          const post = await BlogService.getPostById(parseInt(postId));
          if (post) {
            console.log('📝 Loading post data:', {
              title: post.title,
              slug: post.slug,
              published_date: post.published_date,
              read_time: post.read_time,
              seo_title: post.seo_title,
              seo_description: post.seo_description,
              blog_image: post.blog_image
            });
            
            form.reset({
              title: post.title,
              slug: post.slug || '',
              excerpt: post.excerpt,
              content: post.content,
              author: post.author,
              status: (post.status as 'draft' | 'published') || 'draft',
              publishedDate: post.published_date ? new Date(post.published_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
              readTime: post.read_time || '',
              seoTitle: post.seo_title || '',
              seoDescription: post.seo_description || '',
              seoSchema: (post as any).seo_schema || '',
              blogImage: post.blog_image || '',
            });
            
            // Set image preview if blog_image exists
            if (post.blog_image) {
              setImagePreview(post.blog_image);
            }
            
            // Set character counts for SEO fields
            setSeoTitleCount(post.seo_title?.length || 0);
            setSeoDescriptionCount(post.seo_description?.length || 0);
            
            console.log('✅ Form reset completed with all fields');
          }
        } catch (error) {
          console.error('Error loading post:', error);
          toast({
            title: "Error loading post",
            description: "Failed to load the blog post. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    loadPost();
  }, [postId, isEditing, form, toast]);

  // Load authors for author select
  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const list = await AuthorService.list();
        setAuthors(list.filter(a => a.is_active));
      } catch (e) {
        console.error('Error loading authors', e);
      }
    };
    loadAuthors();
  }, []);

  const onSubmit = async (data: PostFormData) => {
    try {
      console.log('📝 Form submission data:', data);
      console.log('🖼️ Blog image value:', data.blogImage);
      console.log('🖼️ Image preview:', imagePreview);
      console.log('📁 Selected file:', selectedImage);
      
      if (isEditing && postId) {
        // Update existing post
        console.log('🔄 Updating post with ID:', postId);
        await BlogService.updatePost(parseInt(postId), {
          ...data,
        });
        
        toast({
          title: "Post updated",
          description: "The blog post has been updated successfully.",
        });
      } else {
        // Create new post
        console.log('🆕 Creating new post');
        const createData = {
          ...data,
          title: data.title || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          author: data.author || 'Admin',
          status: data.status || 'draft',
        };
        await BlogService.createPost(createData);
        
        toast({
          title: "Post created",
          description: "The blog post has been created successfully.",
        });
      }

      router.push('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };


  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    const slug = generateSlug(value);
    form.setValue('slug', slug);
  };

  const handleSeoTitleChange = (value: string) => {
    setSeoTitleCount(value.length);
  };

  const handleSeoDescriptionChange = (value: string) => {
    setSeoDescriptionCount(value.length);
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('📁 File selected:', file.name, file.type);
      setSelectedImage(file);
      
      try {
        // Show loading state
        setImagePreview('uploading...');
        
        // Try to upload to Supabase Storage first
        try {
          const publicUrl = await StorageService.uploadBlogImage(file);
          console.log('🖼️ Blog image uploaded to Storage, URL:', publicUrl);
          setImagePreview(publicUrl);
          form.setValue('blogImage', publicUrl);
          return;
        } catch (storageError) {
          console.warn('⚠️ Storage upload failed, falling back to base64:', storageError);
          
          // Fallback to base64 if Storage fails
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            console.log('🖼️ File converted to base64, length:', result.length);
            setImagePreview(result);
            form.setValue('blogImage', result);
          };
          reader.readAsDataURL(file);
        }
        
      } catch (error) {
        console.error('❌ Error processing image:', error);
        toast({
          title: "Image Error",
          description: "Failed to process image. Please try again.",
          variant: "destructive",
        });
        
        // Reset on error
        setSelectedImage(null);
        setImagePreview('');
        form.setValue('blogImage', '');
      }
    }
  };

  const handleImageUrlChange = (url: string) => {
    // Clear selected file when manual URL is entered
    setSelectedImage(null);
    // Clear the file input as well
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    form.setValue('blogImage', url);
    setImagePreview(url);
    console.log('🖼️ Manual URL entered:', url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push('/admin/posts')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update your blog post' : 'Write and publish a new article'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button form="post-form" type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form id="post-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter post title..." 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              handleTitleChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Auto-generated from title if empty" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the post..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => {
                      const contentRef = React.useRef<HTMLDivElement>(null);
                      const isInitializingRef = React.useRef(false);
                      
                      // Initialize content when field value changes (only if different)
                      React.useEffect(() => {
                        if (contentRef.current && !isInitializingRef.current) {
                          const currentContent = contentRef.current.innerHTML.trim();
                          const fieldContent = (field.value || '').trim();
                          
                          // Only update if content is actually different
                          if (currentContent !== fieldContent) {
                            isInitializingRef.current = true;
                            contentRef.current.innerHTML = field.value || '';
                            // Reset flag after a brief delay
                            setTimeout(() => {
                              isInitializingRef.current = false;
                            }, 0);
                          }
                        }
                      }, [field.value]);

                      const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        const clipboardData = e.clipboardData;
                        
                        if (!contentRef.current) return;
                        
                        // Function to convert paragraphs with bullet characters to proper lists
                        const convertToLists = (container: HTMLElement) => {
                          // Get all text nodes and elements that might contain list items
                          const walker = document.createTreeWalker(
                            container,
                            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
                            null
                          );
                          
                          const elementsToProcess: HTMLElement[] = [];
                          let node: Node | null;
                          
                          while (node = walker.nextNode()) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                              const element = node as HTMLElement;
                              // Check paragraphs, divs, and spans that might contain list items
                              if (['P', 'DIV', 'SPAN', 'LI'].includes(element.tagName)) {
                                elementsToProcess.push(element);
                              }
                            }
                          }
                          
                          // Process elements and convert bullet points to lists
                          elementsToProcess.forEach((element) => {
                            const text = element.textContent || '';
                            const trimmed = text.trim();
                            
                            // Skip if already in a proper list
                            if (element.closest('ul, ol')) {
                              return;
                            }
                            
                            // Check for bullet points (various bullet characters)
                            const bulletMatch = trimmed.match(/^[\u2022\u25E6\u25AA\u2013\u2014\u2219\u00B7\*\-\+]\s*(.+)$/);
                            if (bulletMatch) {
                              const listItem = document.createElement('li');
                              // Preserve any formatting inside
                              listItem.innerHTML = element.innerHTML.replace(/^[\u2022\u25E6\u25AA\u2013\u2014\u2219\u00B7\*\-\+]\s*/, '');
                              
                              // Find or create ul
                              let ul = element.previousElementSibling as HTMLUListElement;
                              if (!ul || ul.tagName !== 'UL') {
                                ul = document.createElement('ul');
                                element.parentNode?.insertBefore(ul, element);
                              }
                              ul.appendChild(listItem);
                              element.remove();
                            }
                            // Check for numbered list items
                            else {
                              const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s*(.+)$/);
                              if (numberedMatch) {
                                const listItem = document.createElement('li');
                                // Preserve any formatting inside
                                listItem.innerHTML = element.innerHTML.replace(/^\d+[\.\)]\s*/, '');
                                
                                // Find or create ol
                                let ol = element.previousElementSibling as HTMLOListElement;
                                if (!ol || ol.tagName !== 'OL') {
                                  ol = document.createElement('ol');
                                  element.parentNode?.insertBefore(ol, element);
                                }
                                ol.appendChild(listItem);
                                element.remove();
                              }
                            }
                          });
                          
                          // Clean up existing lists
                          container.querySelectorAll('ul, ol').forEach((list) => {
                            // Remove any non-li direct children
                            Array.from(list.children).forEach((child) => {
                              if (child.tagName !== 'LI') {
                                const li = document.createElement('li');
                                li.innerHTML = child.innerHTML;
                                list.replaceChild(li, child);
                              }
                            });
                            
                            // Remove empty list items
                            Array.from(list.querySelectorAll('li')).forEach((li) => {
                              if (!li.textContent?.trim() && !li.innerHTML.trim()) {
                                li.remove();
                              }
                            });
                          });
                          
                          // Wrap orphan li elements
                          container.querySelectorAll('li').forEach((li) => {
                            const parent = li.parentElement;
                            if (!parent || (parent.tagName !== 'UL' && parent.tagName !== 'OL')) {
                              const ul = document.createElement('ul');
                              li.parentNode?.insertBefore(ul, li);
                              ul.appendChild(li);
                            }
                          });
                        };
                        
                        // Try to get HTML first
                        let pastedData = clipboardData.getData('text/html');
                        const plainText = clipboardData.getData('text/plain');
                        
                        // Process HTML if available
                        if (pastedData && pastedData.trim() !== '') {
                          const tempDiv = document.createElement('div');
                          tempDiv.innerHTML = pastedData;
                          
                          // Convert any bullet points in paragraphs to proper lists
                          convertToLists(tempDiv);
                          
                          pastedData = tempDiv.innerHTML;
                        } 
                        // If no HTML, process plain text
                        else if (plainText) {
                          const lines = plainText.split(/\r?\n/);
                          const result: string[] = [];
                          let inList = false;
                          let listType: 'ul' | 'ol' | null = null;
                          
                          lines.forEach((line) => {
                            const trimmed = line.trim();
                            
                            // Check for bullet points
                            const bulletMatch = trimmed.match(/^[\u2022\u25E6\u25AA\u2013\u2014\u2219\u00B7\*\-\+]\s*(.+)$/);
                            if (bulletMatch) {
                              if (!inList || listType !== 'ul') {
                                if (inList && listType === 'ol') {
                                  result.push('</ol>');
                                }
                                result.push('<ul>');
                                inList = true;
                                listType = 'ul';
                              }
                              result.push(`<li>${bulletMatch[1]}</li>`);
                            }
                            // Check for numbered lists
                            else {
                              const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s*(.+)$/);
                              if (numberedMatch) {
                                if (!inList || listType !== 'ol') {
                                  if (inList && listType === 'ul') {
                                    result.push('</ul>');
                                  }
                                  result.push('<ol>');
                                  inList = true;
                                  listType = 'ol';
                                }
                                result.push(`<li>${numberedMatch[2]}</li>`);
                              }
                              // Regular content
                              else {
                                if (inList) {
                                  result.push(listType === 'ul' ? '</ul>' : '</ol>');
                                  inList = false;
                                  listType = null;
                                }
                                if (trimmed) {
                                  result.push(`<p>${trimmed}</p>`);
                                } else {
                                  result.push('<br>');
                                }
                              }
                            }
                          });
                          
                          // Close any open list
                          if (inList) {
                            result.push(listType === 'ul' ? '</ul>' : '</ol>');
                          }
                          
                          pastedData = result.join('');
                        }
                        
                        if (pastedData && contentRef.current) {
                          const selection = window.getSelection();
                          if (selection && selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            range.deleteContents();
                            
                            // Create a temporary container to parse HTML
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = pastedData;
                            
                            // Final cleanup to ensure proper list structure
                            convertToLists(tempDiv);
                            
                            // Preserve list formatting and other HTML elements
                            const fragment = document.createDocumentFragment();
                            Array.from(tempDiv.childNodes).forEach(node => {
                              fragment.appendChild(node.cloneNode(true));
                            });
                            
                            range.insertNode(fragment);
                            
                            // Move cursor after inserted content
                            if (fragment.lastChild) {
                              range.setStartAfter(fragment.lastChild);
                            }
                            range.collapse(true);
                            selection.removeAllRanges();
                            selection.addRange(range);
                            
                            // Update form field
                            field.onChange(contentRef.current.innerHTML);
                          }
                        }
                      };

                      const handleInput = () => {
                        if (contentRef.current && !isInitializingRef.current) {
                          field.onChange(contentRef.current.innerHTML);
                        }
                      };

                      const handleBlur = () => {
                        if (contentRef.current) {
                          field.onChange(contentRef.current.innerHTML);
                        }
                      };

                      return (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <div className="border border-gray-300 rounded-lg">
                              {/* Rich Text Editor Toolbar */}
                              <div className="border-b border-gray-300 p-2 bg-gray-50 flex flex-wrap items-center gap-1">
                                {/* Text Style Dropdown */}
                                <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white">
                                  <option>Normal</option>
                                  <option>Heading 1</option>
                                  <option>Heading 2</option>
                                  <option>Heading 3</option>
                                  <option>Heading 4</option>
                                  <option>Heading 5</option>
                                  <option>Heading 6</option>
                                </select>
                                
                                {/* Text Formatting */}
                                <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => document.execCommand('bold', false)}
                                  >
                                    <Bold className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => document.execCommand('italic', false)}
                                  >
                                    <Italic className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => document.execCommand('underline', false)}
                                  >
                                    <Underline className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => document.execCommand('strikeThrough', false)}
                                  >
                                    <Strikethrough className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Text Color */}
                                <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Palette className="h-4 w-4" />
                                  </Button>
                                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Highlighter className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Lists */}
                                <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (contentRef.current) {
                                        contentRef.current.focus();
                                        document.execCommand('insertUnorderedList', false);
                                        field.onChange(contentRef.current.innerHTML);
                                      }
                                    }}
                                  >
                                    <List className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (contentRef.current) {
                                        contentRef.current.focus();
                                        document.execCommand('insertOrderedList', false);
                                        field.onChange(contentRef.current.innerHTML);
                                      }
                                    }}
                                  >
                                    <ListOrdered className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (contentRef.current) {
                                        contentRef.current.focus();
                                        document.execCommand('indent', false);
                                        field.onChange(contentRef.current.innerHTML);
                                      }
                                    }}
                                  >
                                    <Indent className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (contentRef.current) {
                                        contentRef.current.focus();
                                        document.execCommand('outdent', false);
                                        field.onChange(contentRef.current.innerHTML);
                                      }
                                    }}
                                  >
                                    <Outdent className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Special Characters */}
                                <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Type className="h-4 w-4" />
                                  </Button>
                                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Type className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Alignment */}
                                <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => document.execCommand('justifyLeft', false)}
                                  >
                                    <AlignLeft className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => document.execCommand('justifyCenter', false)}
                                  >
                                    <AlignCenter className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => document.execCommand('justifyRight', false)}
                                  >
                                    <AlignRight className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => document.execCommand('justifyFull', false)}
                                  >
                                    <AlignJustify className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Links and Media */}
                                <div className="flex items-center">
                                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Link className="h-4 w-4" />
                                  </Button>
                                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ImageIcon className="h-4 w-4" />
                                  </Button>
                                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Code className="h-4 w-4" />
                                  </Button>
                                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Type className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Content Editable Div - Preserves formatting */}
                              <div
                                ref={contentRef}
                                contentEditable
                                suppressContentEditableWarning
                                onPaste={handlePaste}
                                onInput={handleInput}
                                onBlur={handleBlur}
                                data-placeholder="Write your blog content here..."
                                className="content-editable min-h-[300px] p-4 border-0 resize-none focus:outline-none focus:ring-0 overflow-y-auto"
                                style={{
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word',
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publish</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an author" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {authors.map(a => (
                              <SelectItem key={a.id} value={a.name}>
                                {a.name} {!a.is_active && '(Inactive)'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="readTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Read Time</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 5 min read" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Published Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="publishedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Published Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Title (max 70 characters)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Optional: Custom title for search engines" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              handleSeoTitleChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <div className="text-sm text-gray-500">
                          {seoTitleCount}/70 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Description (max 160 characters)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Optional: Custom description for search engines"
                            className="min-h-[80px]"
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              handleSeoDescriptionChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <div className="text-sm text-gray-500">
                          {seoDescriptionCount}/160 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SEO Schema (JSON-LD) */}
                  <FormField
                    control={form.control}
                    name="seoSchema"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Schema (JSON-LD)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Paste JSON-LD here. For multiple blocks, separate with a blank line."
                            className="min-h-[140px] font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">This will be rendered as &lt;script type=\"application/ld+json\"&gt; in the blog page source.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blog Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="mx-auto max-h-32 max-w-full object-contain rounded"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setImagePreview('');
                            setSelectedImage(null);
                            form.setValue('blogImage', '');
                            // Clear the file input as well
                            const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                            if (fileInput) {
                              fileInput.value = '';
                            }
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">Upload an image or enter URL below</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Choose File
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Or enter image URL manually</p>
                    <FormField
                      control={form.control}
                      name="blogImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleImageUrlChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.watch('blogImage') && (
                      <div className="mt-2 text-xs text-gray-500">
                        {form.watch('blogImage')?.startsWith('data:') ? 
                          '📁 Using uploaded file' : 
                          '🔗 Using manual URL'
                        }
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PostForm;
