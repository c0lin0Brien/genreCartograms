from main.parsers.countries_genres_styles import style_list, matched, genre_list

# Double checking whether all styles are included in matched
styles_count = 0
for i in range(len(style_list)):
    styles_count += 1

matched_count = 0
for i in range(len(matched)):
    for j in range(len(matched[i])):
        if not matched[i][j] in style_list:
            print(f"matched has {matched[i][j]} and styles_list does not")
        matched_count += 1

# print(styles_count - matched_count)

# new_matched = matched

# index_guide = """[0]Blues, [1]Brass & Military, [2]Childrens, [3]Classical, [4]Electronic, [5]Folk, World, & Country, [6]Funk / Soul, [7]Hip Hop, [8]Jazz, [9]Latin, [10]Non-Music, [11]Pop, [12]Reggae, [13]Rock, [14]Stage & Screen"""

# def get_valid_index(prompt):
#     while True:
#         user_input = input(f"{prompt} \n {index_guide} \n")
#         if user_input.isdigit():
#             return int(user_input)
#         else:
#             print("Invalid input")

# for style in style_list:
#     included = False
#     for i in range(len(matched)):
#         print(f"Looking for {style} in {genre_list[i]}...")
#         if style in matched[i]:
#             included = True
#             print(f"Found {style} in {genre_list[i]}")
#             break
#     if not included:
#         assignment = get_valid_index(style)
#         new_matched[assignment].append(style)
#         print(f"Put {style} in {genre_list[assignment]}")

# print(new_matched)

