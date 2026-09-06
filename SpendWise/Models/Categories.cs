using System.ComponentModel.DataAnnotations;
namespace SpendWise.Models
{
    public class Categories
    {   [Key]
        public int categoryID { get; set; }
        [Required]
      public string categoryNmae { get; set; }
        [Required]
        public string CategoryDescription { get; set; }
         
        public string? imageURL { get; set; }
        public  virtual ICollection<Expenses>? expenses { get; set; }=new List<Expenses>();
    }
}
