import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const POSTS = [
  {id: 1, title: 'Post Title 1'},
  {id: 2, title: 'Post Title 2'},
  {id: 3, title: 'Post Title 3'},
]

function App() {
  const queryClient = useQueryClient();

  /*
    Thinking about query keys

    /posts -> ["posts"]
    /posts/1 -> ["posts", post.id]
    /posts?authorID=1 -> ["posts",{authorId :1}]
    /posts/2/comments -> ["posts", post.id, "comments"]
  */


  const postQuery = useQuery({
    queryKey: ["posts"],//always takes in an array, a unique id for your query. Must be unique for the query youre making
    queryFn: (obj) => wait(1000).then(() => {console.log(obj); return [...POSTS]})//fn always takes in a promise. This is where we would make an API Request
  });

   const newPostMutation = useMutation({
    mutationFn: (title) => {
      return wait(1000).then(
        () => POSTS.push(
          {
            id: crypto.randomUUID(), title: title
          }
        )
      );
    },//function to change the data with the [posts] id
    onSuccess: () => { queryClient.invalidateQueries(["posts"]); }//invalidates the query data, forces a redraw
  }) 

  if (postQuery.isLoading) {
    return <h1>LOADING</h1>
  }
  if (postQuery.isError) {
    return <h3>{ JSON.stringify(postQuery.error) }</h3>
  }

  return (
    <div>{
      postQuery.data.map((post) => 
        <div key={post.key}>
          { post.title }
        </div>
      )
    }
      { <button disabled={newPostMutation.isLoading} onClick={() => newPostMutation.mutate('New Post')}>Push New</button> }
    </div>
  )
}

function wait(duration){
  return new Promise(resolve => setTimeout(resolve, duration));
}

export default App
