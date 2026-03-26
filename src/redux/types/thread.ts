export type BlockType = "TEXT" | "IMAGE" | "VIDEO"

export type Block = {
  type: BlockType
  content?: string
  media?: File | string
}

export type Thread = {
  id: string
  title: string
  categoryId: string
  views:number
  isLocked:boolean
   isPinned:boolean
   lastActivityAt:Date
  post: {
    blocks: Block[]
  }
  createdAt: string
}

export type CreateThreadPayload = {
  title: string
  categoryId: string
  post: {
    blocks: Block[]
  }
}

export type ApiResponse<T = unknown> = {
  data: T
  status: string
  message: string
}

export type PaginatedResponse<T> = {
  data: T
  total: number
  page: number
  limit: number
}

export type ThreadPaginatedResponse<T> = {
  data: {
    threads: T[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }

}

export type User = {
  id:string
  username:string
  avatar:string
}


export type PostWithBlocks = {
  id: string;
  threadId: string;
  userId: string;
  isEdited:boolean
  isDeleted:boolean
  user:User
  blocks: {
    id: string;
    postId:string
    type: string;
    content?: string;
    media: {
      id:string
      url: string;
      type: string;
      publicId:string
    }[];
    order: number;
  }[];
  _count:number
  comments:any
  createdAt: string;
  updatedAt: string;
};

export type PostPaginatedResponse<T> = {
  data: {
    posts: T[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }

}